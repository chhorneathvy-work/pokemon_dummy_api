export async function streamToBuffer(stream) {
  const convertStreamPromise = new Promise<Uint8Array[]>((resolve) => {
    const data = [];

    stream?.on("data", function (chunk) {
      data?.push(chunk);
    });

    stream?.on("end", function () {
      resolve(data);
    });
  });

  const data = await convertStreamPromise;
  const buffer = Buffer?.concat(data);

  return buffer;
}
