export const stringDefault = {
    type: String,
    default: "",
  };
  
  export const reqString = {
    type: String,
    required: true,
  };
  
  export const reqIndexString = {
    type: String,
    required: true,
    index: true,
    unique: true,
  };
  
  export const numberDefault = {
    type: Number,
    default: null
  }