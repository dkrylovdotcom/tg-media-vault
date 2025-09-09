#!/bin/bash
set -e

MOUNT_POINT="/media/pi/wd-disk"
USER="pi"
USER_ID=$(id -u $USER)
GROUP_ID=$(id -g $USER)

echo "Search for NTFS disk..."
DEVICE=$(lsblk -o NAME,FSTYPE,MOUNTPOINT -nr | awk '$2=="ntfs" && $3=="" {print "/dev/"$1; exit}')

if [ -z "$DEVICE" ]; then
  echo "❌ NTFS-disk not found"
  exit 1
fi

echo "Disk was found: $DEVICE"

# Create mount directory
sudo mkdir -p "$MOUNT_POINT"

# Check entry in fstab
if ! grep -q "$MOUNT_POINT" /etc/fstab; then
  echo "📌 Adding record into /etc/fstab..."
  echo "$DEVICE   $MOUNT_POINT   ntfs-3g   defaults,uid=$USER_ID,gid=$GROUP_ID   0   0" | sudo tee -a /etc/fstab
else
  echo "ℹ️ The entry in /etc/fstab already exists."
fi

echo "📂 Mounting the disk...."
sudo mount -a

echo "🎉 Done! The disk is mounted at $MOUNT_POINT and will be available after reboot."
