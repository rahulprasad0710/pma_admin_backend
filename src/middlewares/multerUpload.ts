import multer from "multer";

const multerUpload = multer({
    dest: "uploads/",
    preservePath: true,
    // store files in memory not in disk
    storage: multer.memoryStorage(),
});

export default multerUpload;
