
// 1. Import multer.
import multer from 'multer';

// 2. Configure storage with filename and location.
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/');
    },
    filename: (req, file, cb) => {
        let name = new Date().toISOString().replace(/:/g, "_").replace(".", "_") + "-" + file.originalname.toString().replace(" ", "_");
        cb(null, name);

    },
});

export const upload = multer({
    storage: storage,
});

