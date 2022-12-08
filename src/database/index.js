module.exports = {
    connection: require('./connection'),
    ProductRepository: require('./repository/product-repository'),
    CustomerRepository: require('./repository/customer-repostiory'),
    KeystoreRepository: require('./repository/keystore-repository'),
    OtpRepository: require('./repository/otp-repository'),
    OrderRepository: require('./repository/order-repository'),
    PHistoryRepository: require('./repository/PHistory-repository'),
    DiscountTokenRepository: require('./repository/discountToken-repository'),
    IssueRepository: require('./repository/Issue-repository'),
}
