import Emotion from '../schemas/Emotions';
import User from '../schemas/Users';
import {
  startOfDay,
  endOfDay,
  getHours,
  startOfWeek,
  endOfWeek,
  format,
  parse
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
  async returnAllToday(req, res) {
    const emotions = await Emotion.find({
      user: req.user._id,
      createdAt: {
        $gte: startOfDay(new Date()),
        $lte: endOfDay(new Date())
      }
    });

    const result = emotions.map(res => ({
      classification: res.classification,
      time: getHours(res.createdAt), 
    }));

    return res.json(result);
  }
  async weekEmotions(req, res) {
    const user = await User.findById(req.user._id);
    const byWeek = await Emotion.find({
      user: user._id,
      createdAt: {
        $gte: startOfWeek(new Date()),
        $lte: endOfWeek(new Date())
      },
    })

    const results = byWeek.map(week => ({
      classification: week.classification,
      probability: week.probability,
      week: format(week.createdAt, 'EEEE'),
    }))

    return res.json(results);
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
  async returnAllByDay(req, res) {
    const user = await User.findById(req.user._id);
    const results = await Emotion.aggregate([
      {
        $match: { user: user._id},
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
          date: "$_id",
          classifications: {
            $arrayToObject: "$classifications"
          }
        }
      },
      {
        $sort : { date: 1 }
      },
      {
        $project: {
          _id: 0,
        }
      }
    ])

    return res.json(results);
  }
}

export default new EmotionController();