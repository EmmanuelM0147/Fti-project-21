export const firestoreRules = `
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return request.auth.uid == userId;
    }
    
    // Applications collection rules
    match /applications/{applicationId} {
      // Only authenticated users can create applications
      allow create: if isAuthenticated() 
        && isOwner(request.resource.data.userId)
        && validateApplication(request.resource.data);
      
      // Users can only read their own applications
      allow read: if isAuthenticated() && isOwner(resource.data.userId);
      
      // No updates allowed - applications are final once submitted
      allow update, delete: if false;
      
      // Application validation function
      function validateApplication(application) {
        return application.size() <= 1000000 // Max 1MB document size
          && application.keys().hasAll(['personalInfo', 'academicBackground', 'programSelection', 'accommodation', 'referee'])
          && validatePersonalInfo(application.personalInfo)
          && validateAcademicBackground(application.academicBackground)
          && validateProgramSelection(application.programSelection)
          && validateAccommodation(application.accommodation)
          && validateReferee(application.referee);
      }
      
      function validatePersonalInfo(info) {
        return info.firstName is string
          && info.firstName.size() >= 2
          && info.lastName is string
          && info.lastName.size() >= 2
          && info.email.matches('^[^@]+@[^@]+\\.[^@]+$')
          && info.phone.matches('^\\+[1-9]\\d{1,14}$');
      }
      
      function validateAcademicBackground(academic) {
        return academic.highestQualification is string
          && academic.institution is string
          && academic.graduationYear.matches('^\\d{4}$')
          && academic.grade is string;
      }
      
      function validateProgramSelection(program) {
        return program.program is string
          && program.course is string
          && program.startDate is string
          && program.studyMode in ['full-time', 'part-time', 'weekend'];
      }
      
      function validateAccommodation(accommodation) {
        return accommodation.required is bool;
      }
      
      function validateReferee(referee) {
        return referee.name is string
          && referee.relationship is string
          && referee.organization is string
          && referee.email.matches('^[^@]+@[^@]+\\.[^@]+$')
          && referee.phone.matches('^\\+[1-9]\\d{1,14}$');
      }
    }
  }
}
`;