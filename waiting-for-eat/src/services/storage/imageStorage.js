const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const DEFAULT_BUCKET = "images";

function getStorageConfig() {
  const url = import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, "");
  const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  const bucket = import.meta.env.VITE_SUPABASE_STORAGE_BUCKET || DEFAULT_BUCKET;

  if (!url || !publishableKey) {
    throw new Error(
      "Supabase Storage \u5c1a\u672a\u8a2d\u5b9a\uff0c\u8acb\u6aa2\u67e5\u5c08\u6848 URL \u8207 Publishable Key\u3002",
    );
  }

  return { bucket, publishableKey, url };
}

function encodePath(path) {
  return path.split("/").map(encodeURIComponent).join("/");
}

function createObjectPath(path, file) {
  const directory = String(path || "uploads")
    .replace(/^\/+|\/+$/g, "")
    .replace(/[^a-zA-Z0-9/_-]/g, "-");
  const extension = file.name?.split(".").pop()?.toLowerCase();
  const safeExtension = extension?.match(/^[a-z0-9]+$/) ? `.${extension}` : "";
  const id = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`;

  return `${directory}/${id}${safeExtension}`;
}

function validateImage(file) {
  if (!(file instanceof Blob) || !file.type.startsWith("image/")) {
    throw new TypeError("\u53ea\u80fd\u4e0a\u50b3\u5716\u7247\u6a94\u6848\u3002");
  }

  if (file.size > MAX_IMAGE_SIZE) {
    throw new RangeError("\u5716\u7247\u5927\u5c0f\u4e0d\u53ef\u8d85\u904e 5 MB\u3002");
  }
}

function getUploadErrorMessage(status, responseBody) {
  const details = [
    responseBody?.message,
    responseBody?.error,
    responseBody?.statusCode,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (details.includes("bucket") && details.includes("not found")) {
    return "\u627e\u4e0d\u5230 Supabase Storage Bucket\uff0c\u8acb\u78ba\u8a8d Bucket \u540d\u7a31\u662f\u5426\u70ba images\u3002";
  }

  if (details.includes("mime") || details.includes("content type")) {
    return "\u9019\u500b\u5716\u7247\u683c\u5f0f\u4e0d\u5728 Bucket \u5141\u8a31\u7684 MIME type \u7bc4\u570d\u5167\u3002";
  }

  if (details.includes("jwt") || details.includes("api key")) {
    return "Supabase Publishable Key \u7121\u6548\uff0c\u8acb\u91cd\u65b0\u8907\u88fd\u5c08\u6848\u7684 Publishable Key\u3002";
  }

  if (details.includes("row-level security") || details.includes("policy")) {
    return "Supabase Storage \u6b0a\u9650\u4e0d\u8db3\uff0c\u8acb\u6aa2\u67e5 storage.objects \u7684\u4e0a\u50b3 Policy\u3002";
  }

  if (details.includes("duplicate") || details.includes("already exists")) {
    return "\u540c\u540d\u5716\u7247\u5df2\u5b58\u5728\uff0c\u8acb\u91cd\u65b0\u9078\u64c7\u5716\u7247\u5f8c\u518d\u8a66\u3002";
  }

  if (status === 401 || status === 403) {
    return "Supabase Storage \u62d2\u7d55\u4e0a\u50b3\uff0c\u8acb\u6aa2\u67e5 Publishable Key \u8207 RLS Policy\u3002";
  }

  if (status === 413) {
    return "\u5716\u7247\u592a\u5927\uff0c\u8acb\u4e0a\u50b3 5 MB \u4ee5\u4e0b\u7684\u5716\u7247\u3002";
  }

  if (status === 429) {
    return "\u4e0a\u50b3\u6b21\u6578\u904e\u591a\uff0c\u8acb\u7a0d\u5f8c\u518d\u8a66\u3002";
  }

  if (status === 400) {
    return "Supabase \u7121\u6cd5\u63a5\u53d7\u9019\u6b21\u4e0a\u50b3\uff0c\u8acb\u6aa2\u67e5 Bucket \u540d\u7a31\u3001\u5716\u7247\u683c\u5f0f\u8207\u9650\u5236\u8a2d\u5b9a\u3002";
  }

  return `\u5716\u7247\u4e0a\u50b3\u5931\u6557\uff08\u932f\u8aa4\u4ee3\u78bc ${status}\uff09\u3002`;
}

async function uploadImage(path, file) {
  validateImage(file);

  const { bucket, publishableKey, url } = getStorageConfig();
  const objectPath = createObjectPath(path, file);
  const encodedBucket = encodeURIComponent(bucket);
  const encodedObjectPath = encodePath(objectPath);
  let response;

  try {
    response = await fetch(
      `${url}/storage/v1/object/${encodedBucket}/${encodedObjectPath}`,
      {
        method: "POST",
        headers: {
          apikey: publishableKey,
          "Content-Type": file.type,
          "x-upsert": "false",
        },
        body: file,
      },
    );
  } catch {
    throw new Error(
      "\u7121\u6cd5\u9023\u7dda\u5230 Supabase Storage\uff0c\u8acb\u6aa2\u67e5\u7db2\u8def\u8207\u5c08\u6848 URL\u3002",
    );
  }

  if (!response.ok) {
    let responseBody;

    try {
      responseBody = await response.json();
    } catch {
      // The status code still provides a localized fallback message.
    }

    throw new Error(getUploadErrorMessage(response.status, responseBody));
  }

  return `${url}/storage/v1/object/public/${encodedBucket}/${encodedObjectPath}`;
}

export { uploadImage };
