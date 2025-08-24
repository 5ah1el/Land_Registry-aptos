module sender::land_registry { 

    use std::signer;
    use std::vector;

    struct Property has key, store {
        id: u64,
        owner: address,
        metadata: string::String,
        verified: bool,
    }

    struct Registry has key {
        properties: vector<Property>,
    }

    public entry fun register_property(
        account: &signer,
        property_id: u64,
        metadata: string::String
    ) {
        let owner = signer::address_of(account);
        let registry = borrow_global_mut<Registry>(owner);
        vector::push_back(
            &mut registry.properties,
            Property {
                id: property_id,
                owner,
                metadata,
                verified: false,
            },
        );
    }

    public entry fun transfer_property(
        account: &signer,
        property_id: u64,
        new_owner: address
    ) {
        let registry = borrow_global_mut<Registry>(signer::address_of(account));
        let props = &mut registry.properties;
        let len = vector::length(props);
        let i = 0;
        while (i < len) {
            let prop = &mut vector::borrow_mut(props, i);
            if (prop.id == property_id) {
                prop.owner = new_owner;
                return;
            };
            i = i + 1;
        };
    }

    public entry fun set_verified(account: &signer, property_id: u64, verified: bool) {
        let registry = borrow_global_mut<Registry>(signer::address_of(account));
        let props = &mut registry.properties;
        let len = vector::length(props);
        let i = 0;
        while (i < len) {
            let prop = &mut vector::borrow_mut(props, i);
            if (prop.id == property_id) {
                prop.verified = verified;
                return;
            };
            i = i + 1;
        };
    }

    public fun init_registry(account: &signer) {
        move_to(account, Registry { properties: vector::empty<Property>() });
    }

   public fun init_registry(account: &signer) {
    move_to(account, Registry { properties: vector::empty<Property>() });
}

#[view]
public fun get_info(owner: address, property_id: u64): string::String {
    let registry = borrow_global<Registry>(owner);
    let props = &registry.properties;
    let len = vector::length(props);
    let mut i = 0;
    while (i < len) {
        let prop = vector::borrow(props, i);
        if (prop.id == property_id) {
            return prop.metadata;
        };
        i = i + 1;
    };
    string::utf8(b"Not Found")
}

}
