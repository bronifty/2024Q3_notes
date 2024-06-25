# bare metal ubuntu server setup

- Dual Boot Ubuntu Macbook Tutorial

1. create MS-DOS (FAT) partition on macbook with 62GB space
2. download ubuntu desktop LTS
3. download unetbootin
4. format usb drive to FAT32 (exFAT works fine)
5. use unetbootin to create bootable usb drive
6. restart macbook and press option key
7. select EFI boot
8. install ubuntu

   1. installation type - something else
   2. select the 62GB partition
   3. press minus button to delete the partition
   4. press plus button to create new partition out of free space with 1000MB | Primary | Beginning | EFI System Partition (kernel)
   5. press plus button to create new partition out of free space with 61GB | Primary | Beginning | Ext4 journaling file system | / (rootfs)
   6. select EFI System Partition (kernel) and choose device for boot loader installation as the partition created in step 4 (same partition as kernel per se)
   7. click install now
   8. continue

9. restart macbook
10. press option key

---

## Note: to reimage, erase the partition keeping the same format (MS DOS FAT) from Mac boot and restart at step 6 above
> To remove the dual boot partition, erase the partition and reformat it as Mac OS Extended Journaled 
>> Here is a sample script that can be run to do that

```bash
diskutil list # identify ubuntu efi partition
diskutil eraseVolume JHFS+ empty /dev/disk0s3
```


### Reference Notes
- https://unetbootin.github.io/
- ubuntu.com (desktop LTS)
- [dual boot ubuntu on macbook; auto-cpufreq](https://www.youtube.com/watch?v=KIgxEEzT9ek&t=835s)
- [auto-cpufreq](https://github.com/AdnanHodzic/auto-cpufreq)

```bash
sudo apt update && sudo apt install curl git 
sudo snap install auto-cpufreq
sudo auto-cpufreq --install
sudo auto-cpufreq --stats
```

### Nex Server 
- [kevin hoffman nex demo](https://youtu.be/EfxtiKMnoyQ?si=43tlix2Urrw2F7w8)
- [synadia nats nex docs](https://docs.nats.io/using-nats/nex/getting-started/deploying-services)

# Settings

```bash
gnome-system-monitor
nautilus /home/bro/codes/
```

### Hotkeys

- open terminal
> ctrl + alt + t 


### Commands

- copy ssh key
```bash
cat ~/.ssh/id_rsa.pub | xclip -selection clipboard
```

