export const npcValidation = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
  },
  role: {
    required: true,
    minLength: 2,
    maxLength: 50,
  },
  descriptor: {
    required: false,
    maxLength: 100,
  },
  race: {
    required: false,
    maxLength: 50,
  },
  agenda: {
    required: false,
    maxLength: 500,
  },
};
