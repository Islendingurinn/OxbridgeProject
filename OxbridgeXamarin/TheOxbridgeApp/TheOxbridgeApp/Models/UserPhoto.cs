using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.IO;
using System.Runtime.CompilerServices;
using System.Text;
using Xamarin.Forms;

namespace TheOxbridgeApp.Models
{
    public class UserPhoto : INotifyPropertyChanged
    {
        private byte[] picture;
        public byte[] Picture
        {
            get => picture;
            set
            {
                picture = value;
                //RaisePropertyChanged(() => Picture);
                PictureSource = ImageSource.FromStream(() => new MemoryStream(picture));
            }
        }

        private ImageSource pictureSource = ImageSource.FromFile("steve2.jpg");
        public ImageSource PictureSource
        {
            set
            {
                pictureSource = value;
                RaisePropertyChanged();
            }
            get
            {
                return pictureSource;// Device.RuntimePlatform == Device.Android ? ImageSource.FromFile(filename) : null;
            }
        }

        public event PropertyChangedEventHandler PropertyChanged;
        public void RaisePropertyChanged([CallerMemberName] string propertyName = null)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }
    }
}
