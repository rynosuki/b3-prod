#!/bin/sh
cd ~

# Upload js
sudo scp -i rs223dj_key_ssh.pem -r /mnt/c/users/robin/b3-production/js ubuntu@194.47.178.79:/var/www/express

# Upload css
sudo scp -i rs223dj_key_ssh.pem -r /mnt/c/users/robin/b3-production/public ubuntu@194.47.178.79:/var/www/express

# Upload server
sudo scp -i rs223dj_key_ssh.pem -r /mnt/c/users/robin/b3-production/server ubuntu@194.47.178.79:/var/www/express

# Upload views
sudo scp -i rs223dj_key_ssh.pem -r /mnt/c/users/robin/b3-production/views ubuntu@194.47.178.79:/var/www/express
