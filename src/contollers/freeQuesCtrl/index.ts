import { Request, response, Response, NextFunction } from "express";
import { IReqAuth } from "../../types/express";
import { pagination } from "../../utilities/utils";
import Appointments from "../../models/appointment";
import FreeHealthQues from "../../models/freeHealthQuesModel";
import FreeHealthAnswers from "../../models/freeHealthQuesModel/FreeHealthAnsModel";

const quesAnswerCtrl = {
  getAllQuestions: async (req: IReqAuth, res: Response) => {
    try {
      if (!req.admin && !req.user && !req.doctor)
        return res.status(401).json({ message: "Invalid Authentication." });

      const { limit, skip, page } = pagination(req);
      const totalItems = await FreeHealthQues.countDocuments();


      const questions = await FreeHealthQues.find()
        .limit(limit)
        .skip(skip)
        .sort({ createdAt: -1 })
        .populate("user");

      return res.status(200).json({
        message: "Successful",
        page,
        totalItems,
        questions,
      });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  },
  getAllAnswers: async (req: IReqAuth, res: Response) => {
    try {
      if (!req.admin && !req.user && !req.doctor)
        return res.status(401).json({ message: "Invalid Authentication." });

      const { limit, skip, page } = pagination(req);

      const answers = await FreeHealthAnswers.find()
        .limit(limit)
        .skip(skip)
        .sort({ createdAt: -1 });

      return res.status(200).json({
        message: "Successful",
        page,
        count: answers.length,
        answers,
      });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  },
  getOneQues: async (req: IReqAuth, res: Response) => {
    try {
      if (!req.admin && !req.user && !req.doctor)
        return res.status(401).json({ message: "Invalid Authentication." });

      const { id } = req.params;

      const question = await FreeHealthQues.findById(id)
      .populate("user")
      .populate("answers")

      if (!question)
        return res.status(404).json({ message: "User Question not found." });

      return res.status(200).json({
        message: "Successful",
        question,
      });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  },


  getOneAnswer: async (req: IReqAuth, res: Response) => {
    try {
      if (!req.admin && !req.user && !req.doctor)
        return res.status(401).json({ message: "Invalid Authentication." });

      const { id } = req.params;

      const answer = await FreeHealthAnswers.findById(id).populate("question")

      if (!answer)
        return res.status(404).json({ message: "Doctor Answer not found." });

      return res.status(200).json({
        message: "Successful",
        answer,
      });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  },
  getUserQues: async (req: IReqAuth, res: Response) => {
    try {
      if (!req.user)
        return res.status(401).json({ message: "Invalid Authentication." });

      const { limit, skip, page } = pagination(req);

      const questions = await Appointments.find({ user: req.user.id })
        .limit(limit)
        .skip(skip)
        .sort({ createdAt: -1 });

      return res.status(200).json({
        message: "Successful",
        page,
        count: questions.length,
        questions,
      });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  },

  createQuestion: async (req: IReqAuth, res: Response) => {
    try {
      if (!req.user)
        return res.status(401).json({ message: "Invalid Authentication." });

      const {
        medications,
        allergies,
        previouslyDiagnosed,
        question,

        conditionName,
        conditionTime,
        optionalNote,
        currentlyHaveThisCondition,

        firstName,
        lastName,
        relationship,
        dateOfBirth,
      } = req.body;

      const questionn = new FreeHealthQues({
        user: req.user._id,
        medications,
        allergies,
        previouslyDiagnosed,
        question,

        condition: {
          conditionName,
          conditionTime,
          optionalNote,
          currentlyHaveThisCondition
        },

        someoneElse: {
          firstName,
          lastName,
          relationship,
          dateOfBirth,
        },
      });

      await questionn.save();

      return res.status(200).json({
        message: "Successful",
        question: questionn,
      });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  },

  createAnswer: async (req: IReqAuth, res: Response) => {
    try {
      if (!req.admin && !req.doctor)
        return res.status(401).json({ message: "Invalid Authentication." });

      const { questionId } = req.params;

      const { content } = req.body;

      const answer = new FreeHealthAnswers({
        question: questionId,
        doctor: req.admin ? req.admin : req.doctor,
        content,
      });

      await answer.save()

      await FreeHealthQues.findByIdAndUpdate(questionId, {
        $push: { answers: answer._id },
      });

      return res.status(200).json({
        message: "Successful",
        answer,
      });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  },

  getAnswersByQuestions: async (req: IReqAuth, res: Response) => {
    try {
      if (!req.admin && !req.user && !req.doctor)
        return res.status(401).json({ message: "Invalid Authentication." });

      const { questionId } = req.params;

      const answers = await FreeHealthAnswers.find({question: questionId})
      .populate("question")
      .populate("doctor")


      return res.status(200).json({
        message: "Successful",
        answers,
      });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  },

  example: async (req: IReqAuth, res: Response, next: NextFunction) => {
    try {
      const { user } = req;

      res.status(201).json({
        message: "User registered successfully.",
        user,
      });
    } catch (err: any) {
      res.status(500).json({ message: "Server error.", error: err.message });
    }
  },
};

export default quesAnswerCtrl;
