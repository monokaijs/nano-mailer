import {dbService} from "@/lib/services/db";
import {UserRole} from "@/lib/types/models/user";
import bcrypt from "bcryptjs";
import {withApi} from "@/lib/utils/withApi";
import {registerSchema} from "@/lib/validations/register";

export const POST = withApi(async (request, context) => {
  const body = context.data;
  const {username, password, fullName} = body;

  if (!username || typeof username !== 'string') {
    throw {code: 400, message: "Username is required"};
  }

  if (!password || typeof password !== 'string') {
    throw {code: 400, message: "Password is required"};
  }

  if (!fullName || typeof fullName !== 'string') {
    throw {code: 400, message: "Full name is required"};
  }

  const existingUser = await dbService.user.findOne({username});
  if (existingUser) {
    throw {code: 400, message: "Username already exists"};
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await dbService.user.create({
    username,
    password: hashedPassword,
    fullName,
    role: UserRole.Reader,
  });

  return {
    message: "Registration successful",
    user: {
      username: user.username,
      fullName: user.fullName,
      role: user.role,
    },
  };
}, {
  isPublic: true,
  schema: registerSchema,
});

