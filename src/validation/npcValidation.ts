export const npcValidation = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
  },
  role: {
    required: true,
    minLength: 2,
    maxLength: 40,
  },
  descriptor: {
    required: false,
    minLength: 0,
    maxLength: 80,
  },
  race: {
    required: false,
    minLength: 0,
    maxLength: 40,
  },
  agenda: {
    required: false,
    minLength: 0,
    maxLength: 200,
  },
} as const;
