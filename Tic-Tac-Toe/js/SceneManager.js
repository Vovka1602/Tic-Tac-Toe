class SceneManager
{
    current_scene = null;
    constructor({ SceneBuilder, InputManager })
    {
        this.builder = SceneBuilder;
        this.input_manager = InputManager;
    }

    start()
    {
        this.builder.startLoop();
        this.input_manager.start();
    }
    
    async load_scene(scene)
    {
        if (this.current_scene)
        {
            this.current_scene.pause();
        }
        await scene.loading();
        this.current_scene = scene;
        await scene.start();
        this.builder.on('drawScene', () => scene.drawScene())

        this.input_manager.on('click', (event, params) => scene.click(params));
        scene.drawScene();
    }
}