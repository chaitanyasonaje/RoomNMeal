import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaEye, FaEyeSlash, FaUser, FaEnvelope, FaLock, FaPhone } from 'react-icons/fa';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Typography from '../components/ui/Typography';
import Card from '../components/ui/Card';
import Layout from '../components/ui/Layout';
import PasswordStrength from '../components/PasswordStrength';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'student'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState([]);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordValidation = (isValid, errors) => {
    setPasswordValid(isValid);
    setPasswordErrors(errors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!passwordValid) {
      alert('Please ensure your password meets all requirements');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    setLoading(true);

    const { confirmPassword, ...registerData } = formData;
    const result = await register(registerData);
    
    if (result.success) {
      // Redirect to email verification page
      navigate('/email-verification', {
        state: {
          userId: result.userId,
          email: result.email
        }
      });
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12">
      <Layout.Container size="sm">
        <div className="text-center mb-8">
          <Typography variant="heading-1" className="mb-2">
            Create Account
          </Typography>
          <Typography variant="body" className="text-gray-600">
            Join RoomNMeal and start your journey
          </Typography>
        </div>

        <Card className="max-w-md mx-auto">
          <Card.Body>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <Input
                label="Full Name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                icon={<FaUser className="h-5 w-5" />}
                required
              />

              <Input
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                icon={<FaEnvelope className="h-5 w-5" />}
                required
              />

              <Input
                label="Phone Number"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                icon={<FaPhone className="h-5 w-5" />}
                required
              />

              <div className="form-group">
                <label htmlFor="role" className="form-label">
                  I am a
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="form-input form-select"
                >
                  <option value="student">Student</option>
                  <option value="host">Room/Hostel Owner</option>
                  <option value="messProvider">Mess Provider</option>
                </select>
              </div>

              <div>
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  icon={<FaLock className="h-5 w-5" />}
                  iconPosition="right"
                  required
                />
                <PasswordStrength
                  password={formData.password}
                  onValidationChange={handlePasswordValidation}
                />
              </div>

              <Input
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                icon={<FaLock className="h-5 w-5" />}
                iconPosition="right"
                required
              />

              <div className="flex items-center">
                <input
                  id="agree-terms"
                  name="agree-terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="agree-terms" className="ml-2 block text-sm">
                  I agree to the{' '}
                  <a href="#" className="text-primary-600 hover:text-primary-500">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-primary-600 hover:text-primary-500">
                    Privacy Policy
                  </a>
                </label>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                loading={loading}
                disabled={loading}
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Already have an account?</span>
                </div>
              </div>

              <div className="mt-6">
                <Link to="/login">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full"
                  >
                    Sign in to your account
                  </Button>
                </Link>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Layout.Container>
    </div>
  );
};

export default Register; 