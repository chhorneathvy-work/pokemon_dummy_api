import { GraphQLError } from "graphql";
import { FileUpload } from "graphql-upload-minimal";
import ContextType from "src/graphql/ContextType";
import byteSize from "byte-size";
import { streamToBuffer } from "../../functions/streamToBuffer";
import request from "request-promise";

export const UploadDocumentMutation = async (
  _,
  { file }: { file: FileUpload },
  ctx: ContextType
) => {
  const { createReadStream, filename, mimetype, encoding } = await file;

  const stream = await createReadStream();

  const [application, fileType] = mimetype.split("/");

  const buffer = await streamToBuffer(stream);

  if (!process.env.S3) {
    throw new GraphQLError(
      `{"errorMessage": "Invalid S3!", "typeError": "upload_error"}`
    );
  }

  const url = process.env.S3 + "/upload";

  const mocspace = {
    value: buffer,
    options: {
      filename: filename,
      contentType: mimetype,
    },
  };

  const auth = process.env.AUTHORIZATION;

  if (!auth) {
    throw new GraphQLError(
      `{"errorMessage": "Action Restricted!", "typeError": "upload_error"}`
    );
  }

  const res = await request.post({
    url,
    formData: {
      mocspace,
    },
    auth: {
      bearer: auth,
    },
    json: true,
  });

  const fileSize = byteSize(buffer?.length);

  const filename_arr = filename?.split(".");

  const ext = filename_arr[filename_arr?.length - 1];

  const data = {
    name: filename,
    type: fileType,
    size: Number(fileSize?.value) * 1000,
    ext: ext,
    url: res?.filename,
  };

  return data;
};
