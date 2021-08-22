import Emotion from '../schemas/Emotions';
import User from '../schemas/Users';
import {
  startOfDay,
  endOfDay,
  getHours,
  startOfWeek,
  endOfWeek,
  format,
  parse,
  parseISO,
} from 'date-fns';

class EmotionController {
  async create(req, res) {
    const { classification, probability } = req.body;
    const emotion = new Emotion({
      classification,
      probability,
      user: req.user._id,
    });

    const savedEmotion = await emotion.save();
    return res.json(savedEmotion);
  }
  async weekEmotions(req, res) {
    const user = await User.findById(req.user._id);
    const { date } = req.query;
    const parsedDate = parse(date, 'yyyy-MM-dd', new Date());
    const results = await Emotion.aggregate([
      {
        $match: {
            user: user._id,
            createdAt: {
              $gte: startOfWeek(parsedDate),
              $lte: endOfWeek(parsedDate)
            }
        },
      },
      {
        $group: {
          _id: {
            createdAt: {
              $dateToString: {
                format: "%d/%m/%Y",
                date: "$createdAt"
              }
            },
            classification: "$classification"
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $group: {
          _id: "$_id.createdAt",
          classifications: {
            $push: {
              k: "$_id.classification",
              v: "$count"
            }
          }
        }
      },
      {
        $sort: { _id: 1 }
      },
      {
        $addFields: {
          classifications: {
            $arrayToObject: "$classifications"
          }
        }
      },
    ])

    if (!results) {
      return res.json([]);
    }

    const weekResults = results.map(res => ({
      formattedDate: res._id,
      day: format(parse(res._id, 'dd/MM/yyyy', new Date()), 'EEEE'),
      classifications: res.classifications,
    }));

    return res.json(weekResults);
  }
  async emotionsByDate(req, res) {
    const user = await User.findById(req.user._id);
    const { date } = req.query;
    const parsedDate = parse(date, 'yyyy-MM-dd', new Date());
    const [ results ] = await Emotion.aggregate([
      {
        $match: {
            user: user._id,
            createdAt: {
              $gte: startOfDay(parsedDate),
              $lte: endOfDay(parsedDate)
            }
        },
      },
      {
        $group: {
          _id: {
            createdAt: {
              $dateToString: {
                format: "%d/%m/%Y",
                date: "$createdAt"
              }
            },
            classification: "$classification"
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $group: {
          _id: "$_id.createdAt",
          classifications: {
            $push: {
              k: "$_id.classification",
              v: "$count"
            }
          }
        }
      },
      {
        $addFields: {
          classifications: {
            $arrayToObject: "$classifications"
          }
        }
      },
    ])

    if (!results) {
      return res.json([]);
    }
    
    return res.json(results.classifications);
  }
}

export default new EmotionController();