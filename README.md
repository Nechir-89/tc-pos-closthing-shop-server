# POS SYSTEM FOR CLOTHING SHOP - Server
This system is derived from previous system of POS for super market

### Main changes
We stoped using units and used pcs as primary unit to input and sell/return items. this can change if future versions require more complex system for input items or selling them.

We are starting with version 1.0.0

We originally build and installed this version as version 3.0.0
However I feel we need to start off from version one as this POS system is 
specific for Clothing shop and has different needs

This version can be used for production purposes
And we installed this version for a clothing shop with no problems

This system works great, However it lacks primary features
like 
1. returning an item
1. invoices page
1. Complex statistic
1. Shop expenses (rent, electericity, cashier, and other expenses)

### VERSION 1.1.0
This minor version introduces return items feature
invoices type can be either "sale" or "return"
"sale" for saling items
"return" for returning invoices

client side expected to pass invoice type to server so it can handle request


