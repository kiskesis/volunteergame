use crate::*;

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
pub enum ItemsEnum {
    Helmet,
    Armor,
    Bicycle,
    Car
}

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
pub struct Health {
    max_health: u64,
    health: u64,
}

#[near_bindgen]
impl Contract {
    #[private]
    pub fn check_item_user(&mut self, item: &ItemsEnum, items: &Items) {
        let have_item: bool = match item {
            ItemsEnum::Helmet => items.helmet,
            ItemsEnum::Armor => items.armor,
            ItemsEnum::Bicycle => items.bicycle,
            ItemsEnum::Car => items.car
        };

        assert!(
            !have_item,
            "You already have this item"
        );
    }

    #[private]
    pub fn check_item_deposit(&mut self, item: &ItemsEnum, deposit: u128) {
        const YOKTO_NEAR: u128 = 1000000000000000000000000;
        let enough_deposit: bool = match item {
            ItemsEnum::Helmet => deposit / YOKTO_NEAR >= 2,
            ItemsEnum::Armor => deposit / YOKTO_NEAR >= 5,
            ItemsEnum::Bicycle => deposit / YOKTO_NEAR >= 2,
            ItemsEnum::Car => deposit / YOKTO_NEAR >= 7
        };

        assert!(
            enough_deposit,
            "You have attached not enough deposit"
        );
    }

    #[private]
    pub fn get_items_struct(&mut self, item: &ItemsEnum, mut items: Items) -> Items {
        match item {
            ItemsEnum::Helmet => items.helmet = true,
            ItemsEnum::Armor => items.armor = true,
            ItemsEnum::Bicycle => items.bicycle = true,
            ItemsEnum::Car => items.car = true
        };

        return items;
    }

    #[private]
    pub fn get_health(
        &self,
        item: ItemsEnum,
        health: u64,
        max_health: u64,
    ) -> Health {
        let mut new_health = Health {
            health,
            max_health
        };

        let new_health_points = match item {
            ItemsEnum::Helmet => 20,
            ItemsEnum::Armor => 50,
            ItemsEnum::Bicycle => 5,
            ItemsEnum::Car => 25,
        };

        new_health.max_health = new_health.max_health + &new_health_points;
        new_health.health = new_health.health + new_health_points;
        return new_health;
    }

    #[payable]
    pub fn buy_item(&mut self, item: ItemsEnum) {
        let token_id: TokenId = self.get_token_id(&NFTType::Volunteer);
        let mut card_attr = self.card_attr.get(&token_id).unwrap();
        let deposit = env::attached_deposit();
        self.check_item_deposit(&item, deposit);
        self.check_item_user(&item, &card_attr.items);
        let new_items = self.get_items_struct(&item, card_attr.items);

        let new_health = self.get_health(item, card_attr.health, card_attr.attributes.max_health);

        card_attr.items = new_items;
        card_attr.health = new_health.health;
        card_attr.attributes.max_health = new_health.max_health;

        self.card_attr.insert(&token_id, &card_attr);

        // let mut metadata = self.token_metadata_by_id.get(token_id).unwrap();
        // metadata.media = Some("".to_string());
        // self.token_metadata_by_id.insert(&token_id, &metadata);
    }
}