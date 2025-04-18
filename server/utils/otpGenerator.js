import otpGenerator from 'otp-generator';

const generateOTP = () => {
  return otpGenerator.generate(6, {
    digits: true,
    alphabets: false,
    upperCase: false,
    specialChars: false,
  });
};

export default generateOTP;