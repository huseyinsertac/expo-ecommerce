//use express async handler to catch errors sometime not now
import User from '../models/user.model.js';
export async function addAddress(req, res) {
  try {
    const {
      label,
      fullName,
      streetAddress,
      street,
      city,
      stateCode,
      zip,
      phoneNumber,
      country,
      isDefault,
    } = req.body;

    const user = req.user;

    if (
      !label ||
      !fullName ||
      !streetAddress ||
      !city ||
      !stateCode ||
      !zip ||
      !phoneNumber ||
      !country
    ) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (isDefault) {
      user.addresses.forEach((addr) => (addr.isDefault = false));
    }

    user.addresses.push({
      label,
      fullName,
      streetAddress,
      street,
      city,
      stateCode,
      zip,
      phoneNumber,
      country,
      isDefault: isDefault || false,
    });

    await user.save();

    res.status(201).json({
      message: 'Address added successfully',
      addresses: user.addresses,
    });
  } catch (error) {
    console.error('Error adding address:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
export async function getAddresses(req, res) {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ addresses: user.addresses });
  } catch (error) {
    console.error('Error fetching addresses:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function updateAddress(req, res) {
  try {
    const { addressId } = req.params;

    const user = req.user;
    const address = user.addresses.id(addressId);

    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }
    const {
      label,
      fullName,
      streetAddress,
      street,
      city,
      stateCode,
      zip,
      phoneNumber,
      country,
      isDefault,
    } = req.body;

    if (isDefault) {
      user.addresses.forEach((addr) => (addr.isDefault = false));
    }

    const nextValue = (value, current) =>
      value !== undefined ? value : current;

    address.label = nextValue(label, address.label);
    address.fullName = nextValue(fullName, address.fullName);
    address.streetAddress = nextValue(streetAddress, address.streetAddress);
    address.street = nextValue(street, address.street);
    address.city = nextValue(city, address.city);
    address.stateCode = nextValue(stateCode, address.stateCode);
    address.zip = nextValue(zip, address.zip);
    address.phoneNumber = nextValue(phoneNumber, address.phoneNumber);
    address.country = nextValue(country, address.country);
    address.isDefault = isDefault !== undefined ? isDefault : address.isDefault;

    await user.save();
    res.status(200).json({
      message: 'Address updated successfully',
      addresses: user.addresses,
    });
  } catch (error) {
    console.error('Error updating address:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function deleteAddress(req, res) {
  try {
    const { addressId } = req.params;
    const user = req.user;

    const address = user.addresses.id(addressId);
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    address.deleteOne();
    await user.save();

    res.status(200).json({
      message: 'Address deleted successfully',
      addresses: user.addresses
    });
  } catch (error) {
    console.error('Error deleting address:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function addToWishlist(req, res) {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: req.user._id, wishlist: { $ne: productId } },
      { $addToSet: { wishlist: productId } },
      { new: true }
    ).populate('wishlist');

    if (!updatedUser) {
      const userExists = await User.exists({ _id: req.user._id });

      if (!userExists) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.status(400).json({ message: 'Product already in wishlist' });
    }

    res.status(200).json({
      message: 'Product added to wishlist',
      wishlist: updatedUser.wishlist,
    });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function removeFromWishlist(req, res) {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: req.user._id, wishlist: productId },
      { $pull: { wishlist: productId } },
      { new: true }
    ).populate('wishlist');

    if (!updatedUser) {
      const userExists = await User.exists({ _id: req.user._id });

      if (!userExists) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.status(404).json({ message: 'Product not found in wishlist' });
    }

    res.status(200).json({
      message: 'Product removed from wishlist',
      wishlist: updatedUser.wishlist,
    });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function getWishlist(req, res) {
  try {
    // we are using populate because wishlist is an array of product ids and we want to get the product details
    const user = await User.findById(req.user._id).populate('wishlist');
    res.status(200).json({ wishlist: user.wishlist });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
