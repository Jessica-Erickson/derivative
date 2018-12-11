# Derivative (Current Version: 1.0)

The concept of this project was very simple; Take an image from the user and sort it in order to make an interesting derivative.

## How the initial proof-of-concept works:

1. Take an image from the user, using `input type='file'` and the [File API](https://developer.mozilla.org/en-US/docs/Web/API/File/Using_files_from_web_applications).

2. Parse the image into a graph-like object, with the data of each pixel stored in a key of the x and y coordinates ('xCoordinate-yCoordinate').

3. Randomly choose a pixel to start and move its coordinates to the sorted array.

4. Push all of that pixel's adjacent pixels' coordinates into the frontier array.

5. Randomly select 500 pixels' coordinates from the remaining unsorted pixels.

6. Randomly select a frontier pixel, and find the buffer pixel with the closest color value to the frontier pixel's sorted neighbors.

7. Swap those pixels' rgba values, both on the canvas and in the image graph.

8. Move the frontier pixel's coordinates to the sorted array.

9. Push all of that pixel's adjacent pixels' coordinates into the frontier array.

10. Repeat steps 6 - 9, until the entire image is sorted (when there are no coordinates left in the unsorted pixel array).

Note: When a buffer pixel's coordinates are added to the frontier array, it is removed from the buffer array and replaced by another pixel's coordinates from the remaining unsorted pixels array, if there are any.

## Next steps:

The main problem with my sorter, as it is, is that it gets bogged down for large images. To remedy that, I am looking at offloading the storage of that object to a server with an open channel to the frontend using websockets.

Another issue is that my means of calculating color similarity causes some unappealing pixel noise. To remedy that, I am going to change the color comparison from the averages of the rgba values to a value comparison of each color's hex codes.

I would also like to implement different sorting methods that the user can choose, so that they can see all of the potential ways of seeing art and using art.

Finally, I have a very sparse frontend. To remedy that, I am going to add some significant styling. I want this project to be a public facing tool that shows both the value in remixing art and a potential use of computer programming.

## Contributors:

Jessica Erickson: [GitHub](https://github.com/Jessica-Erickson), [LinkedIn](https://www.linkedin.com/in/j-m-erickson/), [Twitter](https://twitter.com/J_M_Erickson)
