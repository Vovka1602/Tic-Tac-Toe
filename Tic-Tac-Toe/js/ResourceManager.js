class ResourceManager
{
    resources = {};

    getImage(image_name)
    {
        return this.resources[image_name];
    }
    
    loadImages(images)
    {
        return Promise.all(images.map(this.loadImage.bind(this)));
    }

    loadImage(image)
    {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                this.resources[image] = img;
                resolve(img);
            };
            img.src = image;
        });
    }
}