// Internal Imports
const mongoose = require("mongoose");


// Custom Imports
const { responseStatus } = require("../../utils/constants");
const { sendResponse, checkParamsId } = require("../../utils/common");

// Models
const Poll = mongoose.model("Polls");
const Options = mongoose.model("Options");
const UserEnergySpent = mongoose.model("UserEnergySpent");

/**
 * Creates a new Poll
 */
exports.AddPoll = async (req, res) => {
    try {

        let data = req.body;
        let lang = req.headers.lang
        if (!data.title || !data.desc || !data?.options || data?.options?.length < 0) {
            return res.status(responseStatus.code_400).send(sendResponse(null, true, "BAD_REQUEST", lang));
        }
        const PollData = await Poll.create(data)
        if (!PollData) {
            return res.status(responseStatus.code_403).send(sendResponse(null, true, "NOT_ACCEPTABLE", lang));
        }

        return res.status(responseStatus.code_201).send(sendResponse(PollData, false, "SUCCESS", lang));

    } catch (error) {
        return res.status(responseStatus.code_500).send(sendResponse(null, true, error.message));
    }
};

/**
* Get single Poll API
*/

exports.GetPoll = async (req, res) => {
    try {
        let lang = req.headers.lang;
        if (!req.params.id) {
            return res.status(responseStatus.code_400).send(sendResponse(null, true, "BAD_REQUEST", lang));
        }
        await checkParamsId(req.params.id)
        let PollsData = await Poll.findOne({ _id: req.params.id }).populate({ path: "options", model: "Options" })
        return res.status(responseStatus.code_200).send(sendResponse(PollsData, false, "SUCCESS", lang));

    } catch (error) {
        return res.status(responseStatus.code_500).send(sendResponse(null, true, error));
    }
};
/**
* Poll Vote API
*/

exports.VotePoll = async (req, res) => {
    try {
        const data = req.body
        let lang = req.headers.lang;
        const pollID = req.params.id
        if (!pollID || !data.optionId || !data.energy) {
            return res.status(responseStatus.code_400).send(sendResponse(null, true, "BAD_REQUEST", lang));
        }
        await checkParamsId(pollID)
        //Get User Energy Data
        const UserEnergySpentData = await UserEnergySpent.findOne({ user: req.user.id, option: data.optionId })
        if (!UserEnergySpentData) {
            await UserEnergySpent.create({ user: req.user.id, option: data.optionId, currentUserEnergySpent: data.energy })
        } else {
            UserEnergySpentData.currentUserEnergySpent += data.energy
            await UserEnergySpentData.save()
        }
        await Options.findOneAndUpdate(
            { _id: data.optionId },
            { $inc: { overallTotalEnergySpent: data.energy } }
        );
        let pollData = await Poll.findOne({ _id: pollID }).populate({ path: "options", model: "Options" })

        const formattedOptions = pollData.options.map(async option => {
            const currentUserEnergySpent = await UserEnergySpent.findOne({ user: req.user.id, option: option._id }).select('currentUserEnergySpent');
            const currentUserEnergySpentValue = currentUserEnergySpent ? currentUserEnergySpent.currentUserEnergySpent : 0;

            return {
                id: option._id,
                name: option.name,
                imageUrl: option.imageURL,
                overallTotalEnergySpent: option.overallTotalEnergySpent,
                currentUserEnergySpent: currentUserEnergySpentValue
            };
        });

        const finalDta = {
            id: pollData._id,
            title: pollData.title,
            description: pollData.desc,
            options: await Promise.all(formattedOptions)
        };

        return res.status(responseStatus.code_200).send(sendResponse(finalDta, false, "SUCCESS", lang));

    } catch (error) {
        console.log("error===>", error);
        return res.status(responseStatus.code_500).send(sendResponse(null, true, error));
    }
};
/**
* GetAllPoll API
*/

exports.GetAllPoll = async (req, res) => {
    try {
        let data = req.body;
        let lang = req.headers.lang;
        let skip = (Number(data.page) * 10)
        let limit = data.limit
        let getLists = await Poll.find()
        .populate({ path: "options", model: "Options" })
        .limit(limit)
        .skip(skip);
    
      let count = await Poll.countDocuments();
    
      const formattedPolls = await Promise.all(
        getLists.map(async (poll) => {
          const formattedOptions = await Promise.all(
            poll.options.map(async (option) => {
              const currentUserEnergySpent = await UserEnergySpent.findOne({
                user: req.user.id,
                option: option._id,
              }).select('currentUserEnergySpent');
    
              const currentUserEnergySpentValue = currentUserEnergySpent
                ? currentUserEnergySpent.currentUserEnergySpent
                : 0;
    
              return {
                id: option._id,
                name: option.name,
                imageUrl: option.imageURL,
                overallTotalEnergySpent: option.overallTotalEnergySpent,
                currentUserEnergySpent: currentUserEnergySpentValue,
              };
            })
          );
    
          return {
            id: poll._id,
            title: poll.title,
            description: poll.desc,
            options: formattedOptions,
          };
        })
      );
        let finalData = { totalItems: count, PollsData: formattedPolls }
        return res.status(responseStatus.code_200).send(sendResponse(finalData, false, "SUCCESS", lang));

    } catch (error) {
        return res.status(responseStatus.code_500).send(sendResponse(null, true, error.message));
    }
};



