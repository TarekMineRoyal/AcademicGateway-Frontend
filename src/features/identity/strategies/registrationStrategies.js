import { UserRole } from '../../../shared/constants/enums';
import { registerStudent, registerProfessor, registerProvider } from '../identityApi';

export const registrationStrategies = {
  [UserRole.STUDENT]: {
    displayContext: {
      title: 'Student Portal Enrolment',
      subtitle: 'Join as an applicant to browse and claim capstone project opportunities.',
    },
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