use crate::*;
use rand::rngs::StdRng;
use rand::{Rng, SeedableRng};
#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
pub enum EventsEnum {
    Big,
    Middle,
    Basic
}

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
pub struct DeliverReturn {
    card_attr: CardAttr,
    event: EventsEnum,
    event_health: u64,
    event_experience: u64,
}

#[near_bindgen]
impl Contract {
    #[private]
    pub fn get_chance(
        &self,
        items: &Items,
        chance: u8
    ) -> u8 {
        let mut new_chance = chance;
        if items.helmet {
            new_chance = new_chance + 2
        } else if items.armor {
            new_chance = new_chance + 4
        } else if items.bicycle {
            new_chance = new_chance + 3
        } else if items.car {
            new_chance = new_chance + 10
        }
        return new_chance;
    }

    #[private]
    pub fn get_event_health(
        &self,
        random_event: &EventsEnum,
    ) -> u64 {
        match random_event {
            EventsEnum::Big => 20,
            EventsEnum::Middle => 10,
            EventsEnum::Basic => 5,
        }
    }

    pub fn rng(&self) -> u8 {
        let seed: [u8; 32] = env::random_seed().try_into().unwrap();
        let mut rng: StdRng = SeedableRng::from_seed(seed);
        rng.gen_range(0, 100)
    }

    #[private]
    pub fn generate_random_event(
        &self,
        items: &Items,
    ) -> EventsEnum {
        let rng = self.rng();

        let big_chance = self.get_chance(items, 5);
        let middle_chance = self.get_chance(items, 15);

        if rng > 0 && rng < big_chance {
            EventsEnum::Big
        } else if rng > big_chance && rng < middle_chance {
            EventsEnum::Middle
        } else {
            EventsEnum::Basic
        }
    }

    pub fn get_event_experience(
        &self,
        random_event: &EventsEnum
    ) -> u64 {
        match random_event {
            EventsEnum::Big => 15,
            EventsEnum::Middle => 10,
            EventsEnum::Basic => 5,
        }
    }

    pub fn deliver_humanitarian(&mut self) -> DeliverReturn {
        let token_id: TokenId = self.get_token_id(&NFTType::Volunteer);
        let mut card_attr = self.card_attr.get(&token_id).unwrap();

        assert!(
            card_attr.humanitarian != 0,
            "You have no enough humanitarian"
        );
        let random_event = self.generate_random_event(&card_attr.items);
        let event_experience = self.get_event_experience(&random_event);
        let event_health = self.get_event_health(&random_event);
        let new_health = &card_attr.health - event_health;
        card_attr.health = new_health;
        card_attr.experience = card_attr.experience + event_experience;
        card_attr.humanitarian = card_attr.humanitarian - 1;

        if card_attr.experience >= card_attr.max_experience {
            card_attr.max_experience = card_attr.max_experience * 2;
            card_attr.experience = 0;
            card_attr.attributes.unused_points = card_attr.attributes.unused_points + 1;
        }

        self.card_attr.insert(&token_id, &card_attr);

        return DeliverReturn {
            card_attr,
            event: random_event,
            event_health: event_health,
            event_experience,
        }
    }

    #[payable]
    pub fn buy_humanitarian(
        &mut self
    ) {
        let token_id: TokenId = self.get_token_id(&NFTType::Volunteer);
        let deposit = env::attached_deposit();

        let humanitarian_count = deposit / 1000000000000000000000000;
        let mut card_attr = self.card_attr.get(&token_id).unwrap();

        card_attr.humanitarian = card_attr.humanitarian + humanitarian_count;

        self.card_attr.insert(&token_id, &card_attr);
    }
}

