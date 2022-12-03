mongo -- "$MONGO_INITDB_DATABASE" <<EOF
  var rootUser = '$MONGO_INITDB_ROOT_USERNAME';
  var rootPassword = '$MONGO_INITDB_ROOT_PASSWORD';
  var admin = db.getSiblingDB('admin');
  admin.auth(rootUser, rootPassword);

  var user = '$MONGO_INITDB_USERNAME';
  var pwd = '$MONGO_INITDB_PASSWORD';
  db.createUser({user: user, pwd: pwd, roles: [{
    role: "dbOwner",
    db: "nest_seed",
  }]});
EOF