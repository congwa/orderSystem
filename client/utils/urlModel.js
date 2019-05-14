const base = 'http://127.0.0.1:8080';
export var URL = { 
  PROJECT_ROOT: base,
  USER_ORDER_LIST: base + 'user-order-list',//我的订单
  WXPAY_RECHARGE:base +'wxpay-recharge',//充值支付
  WXPAY_ORDER:base +'wxpay-order',//微信支付
  WXPAY_PAYMENT:base +'wxpay-payment',//付款支付
  NAV_INDEX:base +'nav-index', 
  CLEAR_APPOINTMENT:base +'order-appointment-clear',//取消订单
  SIGN:base +'sign',//点击签到
  ORDER_REFUND:base +'order-refund',//申请退款
 UPLOAD_IMAG:base +'commit_uploads',//type ='image' 图片上传接口
 RECHARGE_CONF:base +'recharge-conf',//余额充值优惠信息  NAV_INDEX:'nav-index',
  LIST_INDEX:base +'list-index',
  ORDER_SELECT:base +'order-select',
  BANNER_INDEX: base +'banner-index',
  SHOP_DETAIL: base +'shop-detail', // id:店铺id
  SHOP_DETAIL_LIST:base + 'shop-detail-list', // id:店铺id
  SIGN_LIST: base +'sign-list', //token:用户token
  SIGN: base +'sign', //token:用户token
  STORE_COMMIT: base +'store-commit', //id:店铺id page当前页码 type分类 1 评价 2 有图 score 标签 －1 全部 1 好评
  STORE_LIST: base +'store-list',   //id:店铺id
  STORE_DETAIL: base +'store-detail',
  PUT_EVALUATE: base +'put-evaluate',
  STORE_PUT_SHOPPING:base + 'store-put-shopping',
  STORE_GET_SHOPPING: base +'store-get-shopping',
  STORE_CLEAR_SHOPPING: base +'store-clear-shopping',
  ORDER_FOUND:base +'order-found',
  USER_COMMIT_LIST:base +'user-commit-list',
ORDER_APPOINTMENT_FOUND:base +'order-appointment-found',
  USER_COUPON_LIST:base +'user-coupon-list', //我的优惠券列表
  ORDER_CHOOSE_COUPON:base +'order-choose-coupon',//优惠券列表是否满足
  USER_WALLET_LIST:base +'user-wallet-list',//我的钱包
  USER_AMOUNT:base +'user-amount',//我的余额
  PAYMENT_SELECT_COUPON:base +'payment-select-coupon',//付款页面查看优惠券
  WXPAY_PAYMENT:base +'wxpay-payment',//付款页面查看优惠券
  AMOUNT_PAYMENT:base +'amount-payment',//余额付款
  USER_INFO:base +'user-info',//用户信息
  USER_INTEGRAL_LIST:base +'user-integral-list',//我的积分
  USER_INTEGRAL:base +'user-integral', //我的积分余额
  USER_CHECK_PASSWORD:base +'user-check-passWord', //检测是否设置支付密码
  USER_SET_PASSWORD:base +'user-set-passWord', //设置支付密码
  
  USER_MODIFY_PASSWORD:base +'user-modify-passWord', //修改支付密码
  BINDING_VERIFICATION_CODE:base +'binding_verification_code', //获取短信验证码
  USER_BINDING_MOBILE:base +'user-binding-mobile',    //绑定手机号
  ORDER_SELECT_COUPON:base +'order-select-coupon',    //获取订单可用优惠券
  ORDER_CHOOSE_COUPON:base +'order-choose-coupon',    //订单选择优惠券
  SEARCH:base +'search',
  AMOUNT_ORDER:base +'amount-order', //订单余额支付
  PWD_VERIFICATION_CODE:base +'pwd_verification_code', //获取支付密码修改验证码
  V2_APPOINTMENT_FOUND:base +'v2-appointment-found' //订桌第二版本
 
  


}
