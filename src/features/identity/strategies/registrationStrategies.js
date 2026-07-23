import { UserRole } from '../../../shared/constants/enums';
import { registerStudent, registerProfessor, registerProvider } from '../identityApi';
import StudentRegisterForm from '../components/StudentRegisterForm';
import ProfessorRegisterForm from '../components/ProfessorRegisterForm';
import ProviderRegisterForm from '../components/ProviderRegisterForm';

export const registrationStrategies = {
  [UserRole.STUDENT]: {
    displayContext: {
      title: 'Student Portal Enrolment',
      subtitle: 'Join as an applicant to browse and claim capstone project opportunities.',
    },
    FormComponent: StudentRegisterForm,
    getReviewItems: (formValues) => [
      { label: 'Full Name', value: formValues.fullName },
      { label: 'Target Graduation Year', value: formValues.graduationYear },
    ],
    validate: (formValues) => {
      const isFullNameValid = formValues.fullName.trim().length > 0;
      const isAboutMeValid = !formValues.aboutMe || formValues.aboutMe.length <= 2000;
      return isFullNameValid && isAboutMeValid;
    },
    compileDto: (formValues) => ({
      email: formValues.email,
      username: formValues.email,
      password: formValues.password,
      fullName: formValues.fullName,
      aboutMe: formValues.aboutMe?.trim() || null,
      graduationYear: formValues.graduationYear ? parseInt(formValues.graduationYear, 10) : null,
      majorIds: formValues.majorIds,
      specialtyIds: formValues.specialtyIds,
      skillIds: formValues.skillIds,
    }),
    submitAction: registerStudent,
  },

  [UserRole.PROFESSOR]: {
    displayContext: {
      title: 'Faculty Portal Onboarding',
      subtitle: 'Register your academic profile to supervise, track, and grade milestone projects.',
    },
    FormComponent: ProfessorRegisterForm,
    getReviewItems: (formValues) => [
      { label: 'Faculty Identity', value: formValues.fullName },
      { label: 'Academic Assignment Department', value: formValues.academicDepartment },
      { label: 'Academic Rank Title', value: formValues.rank },
    ],
    validate: (formValues) => {
      const isAboutMeValid = !formValues.aboutMe || formValues.aboutMe.length <= 2000;
      return (
        formValues.fullName.trim().length > 0 &&
        formValues.academicDepartment.trim().length > 0 &&
        formValues.rank.trim().length > 0 &&
        isAboutMeValid
      );
    },
    compileDto: (formValues) => ({
      email: formValues.email,
      username: formValues.email,
      password: formValues.password,
      fullName: formValues.fullName,
      aboutMe: formValues.aboutMe?.trim() || null,
      academicDepartment: formValues.academicDepartment,
      rank: formValues.rank,
      maxSupervisionCapacity: parseInt(formValues.maxSupervisionCapacity, 10) || 3,
    }),
    submitAction: registerProfessor,
  },

  [UserRole.PROVIDER]: {
    displayContext: {
      title: 'Research Partner Onboarding',
      subtitle: 'Register your lab unit or corporate structure to sponsor and propose project templates.',
    },
    FormComponent: ProviderRegisterForm,
    getReviewItems: (formValues) => [
      { label: 'Institution / Corporate Title', value: formValues.companyName },
      { label: 'Portal Verification Website URL', value: formValues.websiteUrl, isUrl: true },
    ],
    validate: (formValues) => {
      return (
        formValues.companyName.trim().length > 0 &&
        formValues.companyDescription.trim().length > 0
      );
    },
    compileDto: (formValues) => ({
      email: formValues.email,
      username: formValues.email,
      password: formValues.password,
      companyName: formValues.companyName,
      companyDescription: formValues.companyDescription,
      websiteUrl: formValues.websiteUrl.trim() || null,
    }),
    submitAction: registerProvider,
  },
};