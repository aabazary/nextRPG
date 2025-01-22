class Boss {
    #tier;
    #health;
    #castingResource;
    #power;
    #preparedness;
    constructor(tier) {
      this.#tier = tier;
      this.#health = 50 + tier * 10;
      this.#castingResource = 20 + tier * 5;
      this.#power = 10 + tier * 3;
      this.#preparedness = 5 + tier * 2;
    }
   // Getters
   get tier() {
    return this.#tier;
  }
  
  get health() {
    return this.#health;
  }
  
  get castingResource() {
    return this.#castingResource;
  }
  
  get power() {
    return this.#power;
  }
  
  get preparedness() {
    return this.#preparedness;
  }
  
  // Setters
  set health(value) {
    if (value >= 0) {
      this.#health = value;
    } else {
      console.warn("Health cannot be negative.");
    }
  }
  
  // Methods
  skill1() {
    return `${this.constructor.name} uses Skill1!`;
  }
  
  skill2() {
    return `${this.constructor.name} uses Skill2!`;
  }
  
  skill3() {
    return `${this.constructor.name} uses Skill3!`;
  }
  getQuestions() {
    return [
      {
        question: "What is 2 + 2?",
        options: ["3", "4", "5", "6"],
        correct: "4",
      },
      {
        question: "Which is the largest planet?",
        options: ["Mars", "Earth", "Jupiter", "Venus"],
        correct: "Jupiter",
      },
      {
        question: "What is the capital of France?",
        options: ["Berlin", "Madrid", "Paris", "Rome"],
        correct: "Paris",
      }]
  }
  }
  
  class Tier1Boss extends Boss {
    constructor() {
      super(1);
      this.health += 5;
    }
  
    skill1() {
      return 'Tier 1 Boss uses a weak attack!';
    }
    getQuestions() {
        return [
          {
            question: "What is 5 + 2?",
            options: ["6", "7", "8", "9"],
            correct: "7",
          },
          {
            question: "Which gas do plants absorb for photosynthesis?",
            options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
            correct: "Carbon Dioxide",
          },
          {
            question: "What is the capital of Canada?",
            options: ["Toronto", "Ottawa", "Vancouver", "Montreal"],
            correct: "Ottawa",
          },
        ];
      }
  }
  
  class Tier2Boss extends Boss {
    constructor() {
      super(2);
      this.health += 20;
    }
  
    skill2() {
      return 'a strong attack!';
    }
    getQuestions() {
        return [
          {
            question: "What is 3 + 3?",
            options: ["5", "6", "7", "8"],
            correct: "6",
          },
          {
            question: "What is the smallest ocean?",
            options: ["Atlantic", "Indian", "Arctic", "Pacific"],
            correct: "Arctic",
          },
          {
            question: "What is the capital of Italy?",
            options: ["Rome", "Milan", "Naples", "Venice"],
            correct: "Rome",
          },
        ];
      }
  }
  
  class Tier3Boss extends Boss {
    constructor() {
      super(3);
      this.health += 50;
    }
  
    skill2() {
      return 'a stronger attack!';
    }
    getQuestions() {
        return [
          {
            question: "What is 9 - 4?",
            options: ["5", "6", "7", "8"],
            correct: "5",
          },
          {
            question: "Which is the longest river in the world?",
            options: ["Nile", "Amazon", "Yangtze", "Mississippi"],
            correct: "Nile",
          },
          {
            question: "What is the capital of Germany?",
            options: ["Berlin", "Munich", "Hamburg", "Frankfurt"],
            correct: "Berlin",
          },
        ];
      }
  }
  
  class Tier4Boss extends Boss {
    constructor() {
      super(4);
      this.health += 100;
    }
  
    skill2() {
      return 'powerful attack!';
    }
    getQuestions() {
        return [
          {
            question: "What is 7 + 8?",
            options: ["14", "15", "16", "17"],
            correct: "15",
          },
          {
            question: "Which is the smallest planet in our solar system?",
            options: ["Mars", "Mercury", "Venus", "Earth"],
            correct: "Mercury",
          },
          {
            question: "What is the capital of Spain?",
            options: ["Barcelona", "Madrid", "Seville", "Valencia"],
            correct: "Madrid",
          },
        ];
      }
  }
  
  class Tier5Boss extends Boss {
    constructor() {
      super(5);
      this.health += 200;
    }
  
    skill2() {
      return 'devastating attack!';
    }
    getQuestions() {
        return [
          {
            question: "What is 12 ÷ 4?",
            options: ["2", "3", "4", "6"],
            correct: "3",
          },
          {
            question: "Which animal is known as the 'King of the Jungle'?",
            options: ["Tiger", "Elephant", "Lion", "Leopard"],
            correct: "Lion",
          },
          {
            question: "What is the capital of Australia?",
            options: ["Sydney", "Melbourne", "Canberra", "Brisbane"],
            correct: "Canberra",
          },
        ];
      }
  }
  
  class Tier6Boss extends Boss {
    constructor() {
      super(6);
      this.health += 400;
    }
  
    skill2() {
      return 'fearsome attack!';
    }
    getQuestions() {
        return [
          {
            question: "What is 6 × 3?",
            options: ["18", "20", "15", "21"],
            correct: "18",
          },
          {
            question: "What is the hottest planet in our solar system?",
            options: ["Venus", "Mars", "Mercury", "Earth"],
            correct: "Venus",
          },
          {
            question: "What is the capital of the United Kingdom?",
            options: ["London", "Edinburgh", "Cardiff", "Belfast"],
            correct: "London",
          },
        ];
      }
  }
  
  class Tier7Boss extends Boss {
    constructor() {
      super(7);
      this.health += 600;
    }
  
    skill2() {
      return 'brutal attack!';
    }
    getQuestions() {
        return [
          {
            question: "What is 10 - 7?",
            options: ["2", "3", "4", "5"],
            correct: "3",
          },
          {
            question: "Which is the fastest land animal?",
            options: ["Cheetah", "Lion", "Horse", "Ostrich"],
            correct: "Cheetah",
          },
          {
            question: "What is the capital of Russia?",
            options: ["St. Petersburg", "Moscow", "Kazan", "Novosibirsk"],
            correct: "Moscow",
          },
        ];
      }
  }
  
  class Tier8Boss extends Boss {
    constructor() {
      super(8);
      this.health += 1000;
    }
  
    skill2() {
      return 'destructive attack!';
    }
    getQuestions() {
        return [
          {
            question: "What is 15 ÷ 5?",
            options: ["2", "3", "4", "5"],
            correct: "3",
          },
          {
            question: "Which planet is known as the Red Planet?",
            options: ["Venus", "Jupiter", "Mars", "Mercury"],
            correct: "Mars",
          },
          {
            question: "What is the capital of China?",
            options: ["Shanghai", "Beijing", "Guangzhou", "Shenzhen"],
            correct: "Beijing",
          },
        ];
      }
  }
  
  class Tier9Boss extends Boss {
    constructor() {
      super(9);
      this.health += 5000;
    }
  
    skill2() {
      return 'overwhelming attack!';
    }
    getQuestions() {
        return [
          {
            question: "What is 4 × 4?",
            options: ["12", "14", "16", "18"],
            correct: "16",
          },
          {
            question: "Which is the largest mammal?",
            options: ["Elephant", "Whale Shark", "Blue Whale", "Giraffe"],
            correct: "Blue Whale",
          },
          {
            question: "What is the capital of Brazil?",
            options: ["São Paulo", "Rio de Janeiro", "Brasília", "Salvador"],
            correct: "Brasília",
          },
        ];
      }
  }
  
  class Tier10Boss extends Boss {
    constructor() {
      super(10);
      this.health += 10000;
    }
  
    skill2() {
      return 'annihilating attack!';
    }
    getQuestions() {
        return [
          {
            question: "What is 8 + 7?",
            options: ["14", "15", "16", "17"],
            correct: "15",
          },
          {
            question: "Which bird is known for its colorful feathers?",
            options: ["Parrot", "Crow", "Sparrow", "Peacock"],
            correct: "Peacock",
          },
          {
            question: "What is the capital of the USA?",
            options: ["New York", "Los Angeles", "Washington D.C.", "Chicago"],
            correct: "Washington D.C.",
          },
        ];
      }
  }
  
  export { Boss, Tier1Boss, Tier2Boss, Tier3Boss, Tier4Boss, Tier5Boss, Tier6Boss, Tier7Boss, Tier8Boss, Tier9Boss, Tier10Boss };
  