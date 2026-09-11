import { Response } from 'express';
import prisma from '../config/prisma';
import { AuthRequest } from '../middleware/auth.middleware';

export const getAddresses = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const addresses = await prisma.address.findMany({
      where: { userId: req.user.id },
      orderBy: { isDefault: 'desc' },
    });

    res.json({ success: true, addresses });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error fetching addresses' });
  }
};

export const createAddress = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { fullName, addressLine1, addressLine2, city, county, eircode, phone, isDefault } = req.body;

    if (!fullName || !addressLine1 || !city || !county || !eircode) {
      res.status(400).json({ message: 'Full name, street address, city, county, and Eircode are required' });
      return;
    }

    // If setting as default, unset existing default addresses
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: req.user.id },
        data: { isDefault: false },
      });
    }

    const addressCount = await prisma.address.count({ where: { userId: req.user.id } });
    const shouldBeDefault = isDefault || addressCount === 0;

    const address = await prisma.address.create({
      data: {
        userId: req.user.id,
        fullName,
        addressLine1,
        addressLine2: addressLine2 || null,
        city,
        county,
        eircode: eircode.toUpperCase().trim(),
        country: 'Ireland',
        phone: phone || null,
        isDefault: shouldBeDefault,
      },
    });

    res.status(201).json({ success: true, message: 'Address created', address });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error creating address' });
  }
};

export const updateAddress = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const { fullName, addressLine1, addressLine2, city, county, eircode, phone, isDefault } = req.body;

    const existing = await prisma.address.findFirst({
      where: { id, userId: req.user.id },
    });

    if (!existing) {
      res.status(404).json({ message: 'Address not found' });
      return;
    }

    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: req.user.id },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.update({
      where: { id },
      data: {
        fullName: fullName || existing.fullName,
        addressLine1: addressLine1 || existing.addressLine1,
        addressLine2: addressLine2 !== undefined ? addressLine2 : existing.addressLine2,
        city: city || existing.city,
        county: county || existing.county,
        eircode: eircode ? eircode.toUpperCase().trim() : existing.eircode,
        phone: phone !== undefined ? phone : existing.phone,
        isDefault: isDefault !== undefined ? isDefault : existing.isDefault,
      },
    });

    res.json({ success: true, message: 'Address updated', address });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error updating address' });
  }
};

export const deleteAddress = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { id } = req.params;

    const existing = await prisma.address.findFirst({
      where: { id, userId: req.user.id },
    });

    if (!existing) {
      res.status(404).json({ message: 'Address not found' });
      return;
    }

    await prisma.address.delete({ where: { id } });

    res.json({ success: true, message: 'Address deleted' });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error deleting address' });
  }
};
