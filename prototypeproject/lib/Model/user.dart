class User {
  int id;
  String firstname;
  String lastname;
  String emailUsername;
  String password;

  User(
      {
      final id,
      final firstname,
      final lastname,
      final emailUsername,
      final password});

  factory User.fromJson(Map<String, dynamic> user) => User( id: user['id'],
      firstname: user['firstname'],
      lastname: user['lastname'],
      emailUsername: user['email'],
      password: user['password']);
   
     
    
  }
