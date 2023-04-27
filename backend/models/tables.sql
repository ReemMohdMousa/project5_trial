CREATE TABLE roles (
  role_id SERIAL NOT NULL,
  role VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP,
  PRIMARY KEY (role_id)
);

CREATE TABLE permissions (
  permission_id SERIAL NOT NULL,
  permission VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP,
  PRIMARY KEY (permission_id)
);

CREATE TABLE role_permission (
  role_permission_id SERIAL NOT NULL,
  role_id INT,
  permission_id INT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES roles(role_id),
  FOREIGN KEY (permission_id) REFERENCES permissions(permission_id),
  PRIMARY KEY (role_permission_id)
);


CREATE TABLE users(
  user_id SERIAL NOT NULL,
  firstName VARCHAR(255),
  lastName VARCHAR(255),
  age INT,
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255),
  role_id INT DEFAULT 2,
  is_deleted SMALLINT DEFAULT 0,
  avatar TEXT,
  coverImg TEXT,
  bio VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES roles(role_id),
  PRIMARY KEY (user_id)
);


CREATE TABLE posts (
  post_id SERIAL NOT NULL,
  content TEXT,
  image TEXT,
  video TEXT,
  user_id INT,
  is_deleted SMALLINT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  likes INT,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  PRIMARY KEY (post_id)
);

CREATE TABLE comments (
  comment_id SERIAL NOT NULL,
  post_id INT,
  content TEXT,
  image TEXT,
  video TEXT,
  user_id INT,
  is_deleted SMALLINT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE,
  PRIMARY KEY (comment_id)
);

CREATE TABLE followers (
  id SERIAL NOT NULL,
  user_id INT,
  follower_id INT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (follower_id) REFERENCES users(user_id)
);

CREATE TABLE followings (
  id SERIAL NOT NULL,
  user_id INT,
  following_id INT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (following_id) REFERENCES users(user_id)
);


CREATE TABLE friend_requests (
  request_id SERIAL NOT NULL,
  sender_id INT,
  receiver_id INT,
  status VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (sender_id) REFERENCES users(user_id),
  FOREIGN KEY (receiver_id) REFERENCES users(user_id)
);

CREATE TABLE friends (
  id SERIAL NOT NULL,
  user1_id INT,
  user2_id INT,
  accepted_at TIMESTAMP,
  FOREIGN KEY (user1_id) REFERENCES users(user_id),
  FOREIGN KEY (user2_id) REFERENCES users(user_id)
);

CREATE TABLE messages (
  message_id SERIAL NOT NULL,
  sender_id INT,
  receiver_id INT,
  content TEXT,
  image TEXT,
  video TEXT,
  is_deleted SMALLINT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (sender_id) REFERENCES users(user_id),
  FOREIGN KEY (receiver_id) REFERENCES users(user_id),
  PRIMARY KEY (message_id)
);

CREATE TABLE notifications (
  notification_id SERIAL NOT NULL,
  user_id INT,
  sender_id INT,
  avatar TEXT,
  content VARCHAR(255),4
  is_deleted SMALLINT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP,
  read BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (sender_id) REFERENCES users(user_id),
  PRIMARY KEY (notification_id)
);

CREATE TABLE likes (
  likes_id SERIAL NOT NULL,
  user_id INT,
  post_id INT,
  is_deleted SMALLINT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (post_id) REFERENCES posts(post_id),
  PRIMARY KEY (likes_id)
);

CREATE TABLE nestedComments (
  nestedComments_id SERIAL NOT NULL,
  post_id INT,
  comment_id INT,
  content VARCHAR(255),
  user_id INT,
  image TEXT,
  is_deleted SMALLINT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (post_id) REFERENCES posts(post_id),
  FOREIGN KEY (comment_id) REFERENCES comments(comment_id)ON DELETE CASCADE,
  PRIMARY KEY (nestedComments_id)
);

CREATE TABLE sharedPost1 (
  sharedPost_id SERIAL NOT NULL,
  sharedPost_content TEXT,
  sharedPost_user_id INT,
  post_id INT,
  sharedPost_is_deleted SMALLINT DEFAULT 0,
  sharedPost_created_at TIMESTAMP DEFAULT NOW(),
  sharedPost_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sharedPost_user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE,
  PRIMARY KEY (sharedPost_id)
);


