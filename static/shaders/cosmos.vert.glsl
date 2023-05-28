void main()
{
    float scale = 10.0;
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position * scale, 1.0);
}
