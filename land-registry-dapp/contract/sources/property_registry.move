module land_registry::property_registry {
    use std::signer;
    use std::string::{Self, String};
    use aptos_framework::object;
    use aptos_token_objects::collection;
    use aptos_token_objects::token;

    const E_NOT_AUTHORIZED: u64 = 1;
    const COLLECTION_NAME: vector<u8> = b"LandRegistry";
    const COLLECTION_DESC: vector<u8> = b"Digital land registry using Aptos Digital Assets";
    const COLLECTION_URI: vector<u8> = b"https://example.com/land";

    // Stores the admin and collection name; published under the admin
    struct Registry has key {
        admin: address,
        collection_name: String,
    }

    // Property metadata stored under the token object address
    struct PropertyInfo has key {
        parcel_id: String,
        location: String,
        area_sq_m: u64,
        owner: address,
    }

    // Initialize the registry and create the collection (call once by admin)
    public entry fun initialize_registry(admin: &signer) {
        let admin_addr = signer::address_of(admin);
        let name = string::utf8(COLLECTION_NAME);
        collection::create_unlimited_collection(
            admin,
            string::utf8(COLLECTION_DESC),
            name,
            option::none(),
            string::utf8(COLLECTION_URI)
        );
        move_to(admin, Registry { admin: admin_addr, collection_name: name });
    }

    // Mint a named token representing a property and give it to owner_addr
    public entry fun register_property(
        admin: &signer,
        parcel_id: String,
        location: String,
        area_sq_m: u64,
        owner_addr: address,
        image_uri: String
    ) acquires Registry {
        let registry = borrow_global<Registry>(signer::address_of(admin));
        assert!(signer::address_of(admin) == registry.admin, E_NOT_AUTHORIZED);

        let ctor = token::create_named_token(
            admin,
            registry.collection_name,
            string::utf8(b"Property deed"),
            parcel_id,
            option::none(),
            image_uri
        );

        // Token object address
        let token_obj = object::object_from_constructor_ref(&ctor);

        // Attach our property info under the token object's storage
        let tok_signer = object::generate_signer(&ctor);
        move_to(&tok_signer, PropertyInfo {
            parcel_id: token::name(&token_obj),
            location,
            area_sq_m,
            owner: owner_addr,
        });

        // Transfer token to owner
        object::transfer(admin, token_obj, owner_addr);
    }

    // Admin transfer by parcel_id (simple demo control)
    public entry fun transfer_property(
        admin: &signer,
        parcel_id: String,
        new_owner: address
    ) acquires Registry, PropertyInfo {
        let registry = borrow_global<Registry>(signer::address_of(admin));
        assert!(signer::address_of(admin) == registry.admin, E_NOT_AUTHORIZED);

        let token_addr = token::create_token_address(&registry.admin, &registry.collection_name, &parcel_id);
        let token_obj = object::address_to_object<token::Token>(token_addr);

        let info = borrow_global_mut<PropertyInfo>(token_addr);
        info.owner = new_owner;

        object::transfer(admin, token_obj, new_owner);
    }

    // View: get property info by parcel_id
    #[view]
    public fun get_property_info(parcel_id: String): (String, String, u64, address) acquires Registry, PropertyInfo {
        let registry = borrow_global<Registry>(@land_registry);
        let token_addr = token::create_token_address(&registry.admin, &registry.collection_name, &parcel_id);
        let info = borrow_global<PropertyInfo>(token_addr);
        (info.parcel_id, info.location, info.area_sq_m, info.owner)
    }
}
