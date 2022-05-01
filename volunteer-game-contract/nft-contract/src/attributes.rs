use crate::*;

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
pub enum AttributesEnum {
    HealthAttr,
    MaxHealth,
    Strength,
    UnusedPoints
}

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
pub struct AttributeStruct {
    health_attr: u64,
    strength: u64,
}

#[near_bindgen]
impl Contract {
    pub fn upgrade_attr(&mut self, updating_attributes: AttributeStruct) {
        let mut attributes = self.get_attributes().unwrap();
        let token_id: TokenId = self.get_token_id(&NFTType::Volunteer);
        let unused_points = attributes.attributes.unused_points;
        let sum_unused_points = updating_attributes.strength + updating_attributes.health_attr;
        let unused_points_condition = attributes.attributes.unused_points >= sum_unused_points;

        assert!(
            unused_points > 0,
            "User don't have enough unused points"
        );

        assert!(
            unused_points_condition,
            "User don't have enough unused points"
        );

        attributes.attributes.strength = attributes.attributes.strength + updating_attributes.strength;
        attributes.attributes.max_health = attributes.attributes.max_health + (updating_attributes.strength * 2);
        attributes.health = attributes.health + (updating_attributes.strength * 2);
        attributes.attributes.health_attr = attributes.attributes.health_attr + updating_attributes.health_attr;
        attributes.attributes.unused_points = attributes.attributes.unused_points - sum_unused_points;

        self.card_attr.insert(&token_id, &attributes);
    }
}