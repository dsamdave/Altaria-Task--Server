

import mongoose, { Schema, Document, Model } from "mongoose";

interface ZoomVariablesSchemaDoc extends Document {

    zoomRefreshToken: string
    
}

const zoomVariableSchema = new mongoose.Schema(
  {
    zoomRefreshToken: { type: String, require: true }
  },
  {
    toJSON: {
      transform(document, returnedObject) {
        // (returnedObject.id = returnedObject._id.toString()),
          delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.createdAt;
        delete returnedObject.updatedAt;
      },
    },
    timestamps: true,
  }
);

export default mongoose.model<ZoomVariablesSchemaDoc>("zoomVariable", zoomVariableSchema);
