use crate::*;

#[near_bindgen]
impl Contract {
    #[private]
    pub fn get_token_id(
        &self,
        token_type: &NFTType
    ) -> TokenId {
        let account_id = env::signer_account_id();
        match token_type {
            NFTType::Volunteer => [&account_id.to_string(), "-volunteer"].concat(),
        }
    }

    #[private]
    pub fn is_token_owner(
        &self,
        token_id: &TokenId
    ) {
        let token_exist = self.tokens_by_id.contains_key(&token_id);

        assert!(
            !token_exist,
            "Token already exists"
        );
    }

    #[private]
    pub fn is_able_to_mint(
        &self,
        token_type: &NFTType,
    ) {
        match token_type {
            NFTType::Volunteer => true,
        };
    }

    pub fn check_token(&self) -> bool {
        let token_id: TokenId = self.get_token_id(&NFTType::Volunteer);

        return self.tokens_by_id.contains_key(&token_id);
    }

    pub fn restore_health(&mut self) {
        let token_id: TokenId = self.get_token_id(&NFTType::Volunteer);
        let mut card_attr = self.card_attr.get(&token_id).unwrap();

        card_attr.health = 100;

        self.card_attr.insert(&token_id, &card_attr);
    }

    pub fn get_attributes(&self) -> Option<CardAttr> {
        let token_id: TokenId = self.get_token_id(&NFTType::Volunteer);

        return self.card_attr.get(&token_id);
    }
}