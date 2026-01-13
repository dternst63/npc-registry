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
    required: true,
    minLength: 3,
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
