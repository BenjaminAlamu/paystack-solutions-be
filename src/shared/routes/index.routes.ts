
// import appRoute from "../../v1/modules/app/app.route";
// import healthRoute from "../../v1/modules/health/health.route";
// import identityVerificationRoute from "../../v1/modules/kyc/routes/identity-verification.route";
// import kycConfigRoute from "../../v1/modules/kyc/routes/kyc-config.route";
import merchantRoute from "../../v1/modules/auth/routes/merchant.route"
import userRoute from "../../v1/modules/auth/routes/user.route"
import loginRoute from "../../v1/modules/auth/routes/login.route"
import uploadRoute from "../../v1/modules/uploads/routes/upload.route"
import productRoute from "../../v1/modules/products/routes/product.route"
import orderRoute from "../../v1/modules/orders/routes/order.route"

export default {
  merchant:merchantRoute,
  user: userRoute,
  login: loginRoute,
  upload: uploadRoute,
  product: productRoute,
  order: orderRoute
};
