use crate::*;

#[near_bindgen]
impl Contract {
    #[private]
    pub fn get_token_data(
        &mut self,
        token_type: &NFTType
    ) -> NewTokenData {
        let token_id: TokenId = self.get_token_id(&token_type);

        self.is_token_owner(&token_id);
        self.is_able_to_mint(token_type);

        return match token_type {
            NFTType::Volunteer => NewTokenData {
                token_id,
                nft_type: NFTType::Volunteer,
                media: "https://ipfs.io/ipfs/bafkreiagkexrm7auackidytcrlag5v7z2zonj3xzfnoxumd5nxxn3blk6e".to_string(),
                title: "Volunteer NFT".to_string(),
                description: "Basic volunteer character without any itemsBar that allows you to play in volunteer game".to_string(),
                copies: 100
            },
        }
    }

    #[payable]
    pub fn nft_mint(
        &mut self,
        token_type: NFTType,
        perpetual_royalties: Option<HashMap<AccountId, u32>>,
    ) {
        let account_id = env::signer_account_id();

        let token_data = self.get_token_data(&token_type);

        //measure the initial storage being used on the contract
        let initial_storage_usage = env::storage_usage();

        // create a royalty map to store in the token
        let mut royalty = HashMap::new();

        // if perpetual royalties were passed into the function:
        if let Some(perpetual_royalties) = perpetual_royalties {
            //make sure that the length of the perpetual royalties is below 7 since we won't have enough GAS to pay out that many people
            assert!(perpetual_royalties.len() < 7, "Cannot add more than 6 perpetual royalty amounts");

            //iterate through the perpetual royalties and insert the account and amount in the royalty map
            for (account, amount) in perpetual_royalties {
                royalty.insert(account, amount);
            }
        }

        //specify the token struct that contains the owner ID
        let token = Token {
            //set the owner ID equal to the receiver ID passed into the function
            owner_id: account_id,
            //we set the approved account IDs to the default value (an empty map)
            approved_account_ids: Default::default(),
            //the next approval ID is set to 0
            next_approval_id: 0,
            //the map of perpetual royalties for the token (The owner will get 100% - total perpetual royalties)
            royalty,
        };

        //insert the token ID and token struct
        self.tokens_by_id.insert(&token_data.token_id, &token);

        let card_attr = CardAttr {
            nft_type: token_data.nft_type,
            experience: 0,
            max_experience: 40,
            humanitarian: 5,
            health: 100,
            attributes: Attributes {
                health_attr: 0,
                max_health: 100,
                strength: 0,
                unused_points: 0,
            },
            items: Items {
                helmet: false,
                armor: false,
                bicycle: false,
                car: false
            },
            volunteer_type: VolunteerType::BASIC
        };

        //insert the token ID and token struct and make sure that the token doesn't exist
        assert!(
            self.card_attr.insert(&token_data.token_id, &card_attr).is_none(),
            "Token already exists for card attribute"
        );

        let metadata = TokenMetadata {
            title: Some(token_data.title),
            description: Some(token_data.description),
            media: Some(token_data.media),
            copies: Some(token_data.copies),
            expires_at: None,
            extra: None,
            issued_at: None,
            media_hash: None,
            reference: None,
            reference_hash: None,
            updated_at: None,
            starts_at: None,
        };

        //insert the token ID and metadata
        self.token_metadata_by_id.insert(&token_data.token_id, &metadata);

        //call the internal method for adding the token to the owner
        self.internal_add_token_to_owner(&token.owner_id, &token_data.token_id);

        // Construct the mint log as per the events standard.
        let nft_mint_log: EventLog = EventLog {
            // Standard name ("nep171").
            standard: NFT_STANDARD_NAME.to_string(),
            // Version of the standard ("nft-1.0.0").
            version: NFT_METADATA_SPEC.to_string(),
            // The data related with the event stored in a vector.
            event: EventLogVariant::NftMint(vec![NftMintLog {
                // Owner of the token.
                owner_id: token.owner_id.to_string(),
                // Vector of token IDs that were minted.
                token_ids: vec![token_data.token_id.to_string()],
                // An optional memo to include.
                memo: None,
            }]),
        };

        // Log the serialized json.
        env::log_str(&nft_mint_log.to_string());

        //calculate the required storage which was the used - initial
        let required_storage_in_bytes = env::storage_usage() - initial_storage_usage;

        //refund any excess storage if the user attached too much. Panic if they didn't attach enough to cover the required.
        refund_deposit(required_storage_in_bytes);
    }
}