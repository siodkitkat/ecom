import mongoose from "mongoose";
import Image, { IImage } from "../models/Image";
import Product from "../models/Product";
import User, { IUser } from "../models/User";
import { deleteImageFromDb } from "../routers/ImagesRouter";
import { env } from "../utils";
import { seedProducts } from "./util";
import { randProductDescription } from "@ngneat/falso";

const getRandomProductDesc = () => {
  let desc = randProductDescription() + " ";
  for (let i = 0; i < 5; i++) {
    desc += randProductDescription() + " ";
  }
  return desc.trim();
};

const SEED_ADMIN = {
  username: env.SEED_USERNAME,
  password: env.SEED_PASSWORD,
};

const seedDb = async (seeder: IUser) => {
  // Remove all existing products and images first
  const products = await Product.find({}).populate("image").populate("User");

  for (let product of products) {
    for (let _image of product.image) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let image = _image as any as IImage;
      try {
        if (image.publicUrl.startsWith(env.R2_PUBLIC_URL)) {
          await deleteImageFromDb({ image: image });
        } else {
          await image.remove();
        }
      } catch (e) {
        console.error("Failed to remove an image");
      }
    }
    await product.delete();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let user = product.User as any as IUser;
    user.products = user.products.filter((userProduct) => !userProduct.equals(product._id));

    await user.save();
  }
  // ^ Remove all existing products and images first

  const randomItems = seedProducts.map((product) => {
    return { ...product, description: getRandomProductDesc() };
  });

  let done = 0;
  for (let item of randomItems) {
    try {
      let image = new Image({ publicUrl: item.image, key: item.image, user: seeder });
      await image.save();

      let product = new Product({
        title: item.title,
        price: Math.round(Math.random() * 10000),
        body: item.description,
        image: [image._id],
        quantity: Math.round(Math.random() * 100),
        User: seeder._id,
      });

      await product.save();

      seeder.products.push(product._id);
      await seeder.save();

      done++;
    } catch (e) {
      continue;
    }
  }

  console.log(`Generated ${done}/${randomItems.length} fake products.`);

  process.exit();
};

(async () => {
  try {
    await mongoose.connect(env.DB_URL);
  } catch (e) {
    throw new Error("Couldn't connect to mongodb.");
  }

  console.log("Loaded image model ", Image);
  console.log("Loaded user model ", User);

  const seedUser = await User.findOne({
    username: SEED_ADMIN.username,
  });

  if (!seedUser) {
    const newUser = new User(SEED_ADMIN);

    User.register(newUser, SEED_ADMIN.password, async (err) => {
      if (err) {
        throw new Error("Failed to create seed products owner");
      }
      await seedDb(newUser);
    });
  } else {
    await seedDb(seedUser);
  }
})();
