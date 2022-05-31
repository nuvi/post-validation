module.exports = function crossStreams (metadata) {
  if (metadata.streams) {
    return metadata.streams.reduce(
      (accumulator, stream) => {
        accumulator[stream.codec_type] = stream;
        return accumulator;
      },
      {}
    );
  }
  return {};
};
