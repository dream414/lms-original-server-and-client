const Department = require("../models/Department");

// =====================================================
// CREATE DEPARTMENT
// =====================================================

exports.createDepartment = async (req, res) => {
  try {
    const { name, code, description, status } = req.body;

    // -------------------------------
    // Validation
    // -------------------------------

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Department name is required",
      });
    }

    if (!code || !code.trim()) {
      return res.status(400).json({
        success: false,
        message: "Department code is required",
      });
    }

    // -------------------------------
    // Check existing name
    // -------------------------------

    const existingName = await Department.findOne({
      name: name.trim(),
    });

    if (existingName) {
      return res.status(409).json({
        success: false,
        message: "Department name already exists",
      });
    }

    // -------------------------------
    // Check existing code
    // -------------------------------

    const existingCode = await Department.findOne({
      code: code.trim().toUpperCase(),
    });

    if (existingCode) {
      return res.status(409).json({
        success: false,
        message: "Department code already exists",
      });
    }

    // -------------------------------
    // Create
    // -------------------------------

    const department = await Department.create({
      name: name.trim(),
      code: code.trim().toUpperCase(),
      description: description?.trim() || "",
      status: status || "Active",
    });

    return res.status(201).json({
      success: true,
      message: "Department created successfully",
      department,
    });
  } catch (error) {
    console.error("CREATE DEPARTMENT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create department",
      error: error.message,
    });
  }
};

// =====================================================
// GET ALL DEPARTMENTS
// =====================================================

exports.getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find()
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: departments.length,
      departments,
    });
  } catch (error) {
    console.error("GET DEPARTMENTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch departments",
      error: error.message,
    });
  }
};

// =====================================================
// GET SINGLE DEPARTMENT
// =====================================================

exports.getDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    const department = await Department.findById(id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    return res.status(200).json({
      success: true,
      department,
    });
  } catch (error) {
    console.error("GET DEPARTMENT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch department",
      error: error.message,
    });
  }
};

// =====================================================
// UPDATE DEPARTMENT
// =====================================================

exports.updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, description, status } = req.body;

    // -------------------------------
    // Find department
    // -------------------------------

    const department = await Department.findById(id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    // -------------------------------
    // Validation
    // -------------------------------

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Department name is required",
      });
    }

    if (!code || !code.trim()) {
      return res.status(400).json({
        success: false,
        message: "Department code is required",
      });
    }

    // -------------------------------
    // Check duplicate name
    // -------------------------------

    const existingName = await Department.findOne({
      name: name.trim(),
      _id: { $ne: id },
    });

    if (existingName) {
      return res.status(409).json({
        success: false,
        message: "Department name already exists",
      });
    }

    // -------------------------------
    // Check duplicate code
    // -------------------------------

    const existingCode = await Department.findOne({
      code: code.trim().toUpperCase(),
      _id: { $ne: id },
    });

    if (existingCode) {
      return res.status(409).json({
        success: false,
        message: "Department code already exists",
      });
    }

    // -------------------------------
    // Update
    // -------------------------------

    department.name = name.trim();
    department.code = code.trim().toUpperCase();
    department.description = description?.trim() || "";
    department.status = status || department.status;

    await department.save();

    return res.status(200).json({
      success: true,
      message: "Department updated successfully",
      department,
    });
  } catch (error) {
    console.error("UPDATE DEPARTMENT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update department",
      error: error.message,
    });
  }
};

// =====================================================
// DELETE DEPARTMENT
// =====================================================

exports.deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    const department = await Department.findById(id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    await Department.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Department deleted successfully",
    });
  } catch (error) {
    console.error("DELETE DEPARTMENT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete department",
      error: error.message,
    });
  }
};