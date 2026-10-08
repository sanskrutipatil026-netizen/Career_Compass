
const mongoose = require("mongoose");

const contactFieldSchema = new mongoose.Schema(
  {
    present: {
      type: Boolean,
      default: false,
    },
    value: {
      type: String,
      default: "",
    },
    suggestion: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const experienceItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "",
    },
    organization: {
      type: String,
      default: "",
    },
    duration: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const roadmapSchema = new mongoose.Schema(
  {
    stage: {
      type: String,
      default: "",
    },
    keywords: {
      type: [String],
      default: [],
    },
  },
  { _id: false }
);

const domainSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "",
    },
    score: {
      type: Number,
      default: 0,
    },
  },
  { _id: false }
);

const resumeImprovementSchema = new mongoose.Schema(
  {
    section: {
      type: String,
      default: "",
    },
    issue: {
      type: String,
      default: "",
    },
    whatToAdd: {
      type: String,
      default: "",
    },
    suggestion: {
      type: String,
      default: "",
    },
    priority: {
      type: String,
      enum: ["high", "medium", "low"],
      default: "medium",
    },
  },
  { _id: false }
);

const sectionSchema = new mongoose.Schema(
  {
    present: {
      type: Boolean,
      default: false,
    },

    items: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },

    suggestion: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const languageItemSchema = new mongoose.Schema(
  {
    language: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const languagesSchema = new mongoose.Schema(
  {
    present: {
      type: Boolean,
      default: false,
    },

    items: {
      type: [languageItemSchema],
      default: [],
    },

    suggestion: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const resumeAnalysisSchema = new mongoose.Schema(
  {
    resume: {
      fileName: {
        type: String,
        default: "",
      },

      fileType: {
        type: String,
        default: "",
      },

      fileSize: {
        type: Number,
        default: 0,
      },

      extractedText: {
        type: String,
        default: "",
      },
    },

    analysis: {
      summary: {
        type: String,
        default: "",
      },

      skills: {
        type: [String],
        default: [],
      },

      strengths: {
        type: [String],
        default: [],
      },

      weaknesses: {
        type: [String],
        default: [],
      },

      overallScore: {
        type: Number,
        default: 0,
      },

      experienceLevel: {
        type: String,
        default: "",
      },

      communicationGaps: {
        type: [String],
        default: [],
      },

      missingIndustrySkills: {
        type: [String],
        default: [],
      },

      roadmap: {
        type: [roadmapSchema],
        default: [],
      },

      contactInfo: {
        name: {
          type: contactFieldSchema,
          default: () => ({}),
        },

        email: {
          type: contactFieldSchema,
          default: () => ({}),
        },

        phone: {
          type: contactFieldSchema,
          default: () => ({}),
        },

        linkedin: {
          type: contactFieldSchema,
          default: () => ({}),
        },

        github: {
          type: contactFieldSchema,
          default: () => ({}),
        },

        portfolio: {
          type: contactFieldSchema,
          default: () => ({}),
        },
      },

      education: {
        type: sectionSchema,
        default: () => ({}),
      },

      experience: {
        present: {
          type: Boolean,
          default: false,
        },

        items: {
          type: [experienceItemSchema],
          default: [],
        },

        suggestion: {
          type: String,
          default: "",
        },
      },

      projects: {
        type: sectionSchema,
        default: () => ({}),
      },

      hobbies: {
        type: sectionSchema,
        default: () => ({}),
      },

      languages: {
        type: languagesSchema,
        default: () => ({}),
      },

      extracurricularActivities: {
        type: sectionSchema,
        default: () => ({}),
      },

      certifications: {
        type: sectionSchema,
        default: () => ({}),
      },

      achievements: {
        type: sectionSchema,
        default: () => ({}),
      },

      missingSections: {
        type: [String],
        default: [],
      },

      resumeImprovements: {
        type: [resumeImprovementSchema],
        default: [],
      },

      domains: {
        type: [domainSchema],
        default: [],
      },
    },
  },

  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.ResumeAnalysis ||
  mongoose.model(
    "ResumeAnalysis",
    resumeAnalysisSchema
  );

