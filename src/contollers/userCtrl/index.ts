import { Request, response, Response, NextFunction } from "express";
import { IReqAuth } from "../../types/express";
import Users from "../../models/userModel";

const userCtrl = {
  upsertBasicInformation: async (req: IReqAuth, res: Response) => {

    if (!req.user)
      return res.status(401).json({ message: "Invalid Authentication." });

    const { patientID } = req.params;
    const basicInformation = req.body;

    try {
      const patient = await Users.findOneAndUpdate(
        { _id: patientID },
        { $set: { "patientInfo.basicInformation": basicInformation } },
        { new: true, upsert: true }
      );

      if(patient){
        patient.firstName = req.body.firstName
        patient.lastName = req.body.lastName
        patient.email = req.body.email
        await patient.save()

        res.status(200).json({
          message: "Successful",
          patient 
        } );

      } else {

        res.status(200).json({
          message: "Update Failed."
        } );

      }
    } catch (error) {
      res.status(400).json({ message: "Error upserting basic information" });
    }
  },

  upsertHealthMetrics: async (req: IReqAuth, res: Response) => {

    if (!req.user)
      return res.status(401).json({ message: "Invalid Authentication." });

    const { patientID } = req.params;
    const healthMetrics = req.body;

    try {
      const patient = await Users.findOneAndUpdate(
        { _id: patientID },
        { $set: { "patientInfo.healthMetrics": healthMetrics } },
        { new: true, upsert: true }
      );
      res.status(200).json({
        message: "Successful",
        patient 
      } );    } catch (error) {
      res.status(400).json({ message: "Error upserting health metrics" });
    }
  },

  upsertCondition: async (req: IReqAuth, res: Response) => {

    if (!req.user)
      return res.status(401).json({ message: "Invalid Authentication." });

    const { patientID, conditionID } = req.params;
    const conditionData = req.body;

    try {
      const patient = conditionID
        ? await Users.findOneAndUpdate(
            { _id: patientID, "patientInfo.conditions._id": conditionID },
            { $set: { "patientInfo.conditions.$": conditionData } },
            { new: true }
          )
        : await Users.findOneAndUpdate(
          { _id: patientID },
          { $push: { "patientInfo.conditions": conditionData } },
            { new: true }
          );

      res.status(200).json(patient?.patientInfo?.conditions);
    } catch (error) {
      res.status(400).json({ message: "Error upserting condition" });
    }
  },

  upsertTreatmentHistory: async (req: IReqAuth, res: Response) => {

    if (!req.user)
      return res.status(401).json({ message: "Invalid Authentication." });

    const { patientID, treatmentID } = req.params;
    const treatmentData = req.body;
  
    try {
      const patient = treatmentID
        ? await Users.findOneAndUpdate(
            { _id: patientID, 'patientInfo.treatmentHistory._id': treatmentID },
            { $set: { 'patientInfo.treatmentHistory.$': treatmentData } },
            { new: true }
          )
        : await Users.findOneAndUpdate(
          { _id: patientID },
          { $push: { 'patientInfo.treatmentHistory': treatmentData } },
            { new: true }
          );
      res.status(200).json(patient?.patientInfo.treatmentHistory);
    } catch (error) {
      res.status(400).json({ message: 'Error upserting treatment history' });
    }
  },

  upsertMedication: async (req: IReqAuth, res: Response) => {

    if (!req.user)
      return res.status(401).json({ message: "Invalid Authentication." });

    const { patientID, medicationID, type } = req.params;  
    const medicationData = req.body;
  
    try {
      const path = `patientInfo.medications.${type}Medication`;
      const patient = medicationID
        ? await Users.findOneAndUpdate(
            { _id: patientID, [`${path}._id`]: medicationID },
            { $set: { [`${path}.$`]: medicationData } },
            { new: true }
          )
        : await Users.findOneAndUpdate(
          { _id: patientID },
          { $push: { [path]: medicationData } },
            { new: true }
          );
      res.status(200).json(patient?.patientInfo.medications);
    } catch (error) {
      res.status(400).json({ message: 'Error upserting medication' });
    }
  },

  upsertLabResult: async (req: IReqAuth, res: Response) => {

    if (!req.user)
      return res.status(401).json({ message: "Invalid Authentication." });

    const { patientID, labResultID } = req.params;
    const labResultData = req.body;
  
    try {
      const patient = labResultID
        ? await Users.findOneAndUpdate(
            { _id: patientID, 'patientInfo.labResults._id': labResultID },
            { $set: { 'patientInfo.labResults.$': labResultData } },
            { new: true }
          )
        : await Users.findOneAndUpdate(
          { _id: patientID },
          { $push: { 'patientInfo.labResults': labResultData } },
            { new: true }
          );
      res.status(200).json(patient?.patientInfo.labResults);
    } catch (error) {
      res.status(400).json({ message: 'Error upserting lab result' });
    }
  },

  upsertImmunization: async (req: IReqAuth, res: Response) => {

    if (!req.user)
      return res.status(401).json({ message: "Invalid Authentication." });

    const { patientID, immunizationID } = req.params;
    const immunizationData = req.body;
  
    try {
      const patient = immunizationID
        ? await Users.findOneAndUpdate(
            { _id: patientID, 'patientInfo.immunization._id': immunizationID },
            { $set: { 'patientInfo.immunization.$': immunizationData } },
            { new: true }
          )
        : await Users.findOneAndUpdate(
          { _id: patientID },
          { $push: { 'patientInfo.immunization': immunizationData } },
            { new: true }
          );
      res.status(200).json(patient?.patientInfo.immunization);
    } catch (error) {
      res.status(400).json({ message: 'Error upserting immunization' });
    }
  },

  upsertClinicalVitals: async (req: IReqAuth, res: Response) => {

    if (!req.user)
      return res.status(401).json({ message: "Invalid Authentication." });

    const { patientID, vitalID } = req.params;
    const clinicalVitalsData = req.body;
  
    try {
      const patient = vitalID
        ? await Users.findOneAndUpdate(
            { _id: patientID, 'patientInfo.clinicalVitals._id': vitalID },
            { $set: { 'patientInfo.clinicalVitals.$': clinicalVitalsData } },
            { new: true }
          )
        : await Users.findOneAndUpdate(
          { _id: patientID },
          { $push: { 'patientInfo.clinicalVitals': clinicalVitalsData } },
            { new: true }
          );
      res.status(200).json(patient?.patientInfo.clinicalVitals);
    } catch (error) {
      res.status(400).json({ message: 'Error upserting clinical vitals' });
    }
  },

  upsertAllergy: async (req: IReqAuth, res: Response) => {

    if (!req.user)
      return res.status(401).json({ message: "Invalid Authentication." });

    const { patientID, allergyID } = req.params;
    const allergyData = req.body;
  
    try {
      const patient = allergyID
        ? await Users.findOneAndUpdate(
            { _id: patientID, 'patientInfo.allergies._id': allergyID },
            { $set: { 'patientInfo.allergies.$': allergyData } },
            { new: true }
          )
        : await Users.findOneAndUpdate(
          { _id: patientID },
          { $push: { 'patientInfo.allergies': allergyData } },
            { new: true }
          );

          res.status(200).json({
            message: "Successful",
            patient: patient?.patientInfo.allergies
          } );
      // res.status(200).json(patient?.patientInfo.allergies);
    } catch (error) {
      res.status(400).json({ message: 'Error upserting allergy' });
    }
  },

  example: async (req: IReqAuth, res: Response) => {},
};

export default userCtrl;
