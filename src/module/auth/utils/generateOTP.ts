export function generateOTP() : string {
  return (Math.ceil(Math.random() * 10000)).toString();
}
