import { gql } from "@apollo/client";

export const ME_QUERY = gql`
query Me {
  me {
    id
    username
    email
    characters {
      id
      name
      level
      class
    }
    activeCharacter {
      id
      name
      class
      health
      castingResource
      level
      power
      preparedness
      experience
      score
      inventory
      gold
      armor {
        helmet
        chestPiece
        leggings
        boots
        gloves
      }
      progress {
        mobsKilled
        questsCompleted
        gatherings
      }
      potionBag {
        tier1
        tier2
        tier3
        tier4
        tier5
        tier6
        tier7
        tier8
        tier9
        tier10
      }
    }
  },
}`;

export const TOP_CHARACTERS_EXPERIENCE= gql`
query TopByExperience {
  topByExperience {
    id
    name
    experience
  }
}`;

export const TOP_CHARACTERS_SCORE= gql`
query TopByScore {
  topByScore {
    id
    name
    score
  }
}`;

export const TOP_CHARACTERS_MOBS_KILLED= gql`
query TopByMobsKilled {
  topByMobsKilled {
    id
    name
    progress {
      mobsKilled
    }
  }
}`;

export const TOP_CHARACTERS_QUESTS_COMPLETED= gql`
query TopByQuestsCompleted {
  topByQuestsCompleted {
    id
    name
    progress {
      questsCompleted
    }
  }
}`;

export const TOP_CHARACTERS_GATHERING= gql`
query TopByGathering {
  topByGathering {
    id
    name
    progress {
      gatherings
    }
  }
}`;

export const TOP_USERS_SCORE= gql`
query TopUsersByScore {
  topUsersByScore {
    username
    totalScore
  }
}`;

export const CLASS_DISTRIBUTION= gql`
query ClassDistribution {
  classDistribution {
    warriors
    mages
    hunters
  }
}`;