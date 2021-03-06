'use strict';

const db        = require(__dirname + '/../lib/mysql');
const winston   = require('winston');


exports.register = (req, res, next) => {

    const data = {
        username:          req.body.username,
        password:          req.body.password,
        employee_id:       req.body.employee_id,
        classification:    req.body.classification,
        given_name:        req.body.given_name,
        middle_name:       req.body.middle_name,
        last_name:         req.body.last_name
    };


    function start () {
        db.query('CALL REGISTER(?, ?, ?, ?, ?, ?, ?);',
                 [data.username, data.password,
                  data.employee_id, data.classification,
                  data.given_name, data.middle_name,
                  data.last_name],
                  send_response);
    }


    function send_response (err, result, args, last_query) {
        if (err) {
            winston.error('Error in creating a faculty user', last_query);
            return next(err);
        }

        res.send(result[0][0]);
    }


    start();
};

exports.update_password = (req, res, next) => {
	const uname = req.body.username;
	const pword = req.body.password;


	//with a new procedure
	db.query(
		'CALL UPDATE_FACULTY_PASSWORD(?, ?)',
		[uname, pword],
		responder
	);

	function responder (err, result){
		if (err) {
			winston.error('Error in updating Faculty User Password!', last_query);
			return next(err);
		}
		res.send(true)
	}
}

exports.update_profile = (req, res, next) => {
	const given_name = req.body.given_name;
	const middle_name = req.body.middle_name;
	const last_name = req.body.last_name;
	const classification = req.body.classification;
	const uname = req.body.username;
	db.query(
		[
			'UPDATE faculty_user SET given_name=?, middle_name=?, last_name=?, classification=?',
			'WHERE username=?;'
		].join(' '),[given_name, middle_name, last_name, classification, uname],responder
	);

	function responder(err, result){
		if(err){
			winston.error('Error in updating Faculty Profile'+err);
			res.send(false);
            return next(err);
        }
        req.session.user.given_name = given_name;
        req.session.user.middle_name = middle_name;
        req.session.user.last_name = last_name;
        req.session.user.classification = classification;
        res.send(true);
	}
}

exports.update_name = (req, res, next) => {
	const given_name = req.body.given_name;
	const middle_name = req.body.middle_name;
	const last_name = req.body.last_name;
	const uname = req.body.username;

	db.query(
		[
			'UPDATE faculty_user SET given_name=?, middle_name=?, last_name=?',
			'WHERE username=?;'
		].join(' '),[given_name, middle_name, last_name, uname],responder
	);

	function responder(err, result){
		if(err){
			winston.error('Error in updating Faculty Name'+err);
			res.send(false);
            return next(err);
        }
        req.session.user.given_name = given_name;
        req.session.user.middle_name = middle_name;
        req.session.user.last_name = last_name;
        res.send(true);
	}
}

exports.update_colour_profile = (req, res, next) => {
	const design_setting = req.body.design_setting;
	const uname = req.body.username;
	db.query(
		[
			'UPDATE faculty_user SET design_setting=?',
			'WHERE username=?;'
		].join(' '),[design_setting, uname],responder
	);

	function responder(err, result){
		if(err){
			winston.error('Error in updating Faculty Design Setting'+err);
			res.send(false);
            return next(err);
        }
        req.session.user.design_setting = design_setting;
        res.send(true);
	}
}

exports.update_classification = (req, res, next) => {
	const classification = req.body.classification;
	const uname = req.body.username;
	db.query(
		[
			'UPDATE faculty_user SET classification=?',
			'WHERE username=?;'
		].join(' '),[classification, uname],responder
	);

	function responder(err, result){
		if(err){
			winston.error('Error in updating Faculty Classification'+err);
			res.send(false);
            return next(err);
        }
        req.session.user.classification = classification;
        res.send(true);
	}
}

exports.update_design = (req, res, next) => {
    const design_setting = req.body.design_setting;
    const uname = req.body.username;
    db.query(
        [
            'UPDATE faculty_user SET design_setting=?',
            'WHERE username=?;'
        ].join(' '),[design_setting, uname],responder
    );

    function responder(err, result){
        if(err){
            winston.error('Error in updating Faculty Design Settings'+err);
            res.send(false);
            return next(err);
        }
        req.session.user.design_setting = design_setting;
        res.send(true);
    }
}


exports.check_faculty_user_username = (req, res, next) => {
  const username = req.body.username;

  db.query(
    [
      'SELECT username FROM faculty_user',
      'WHERE username = ?; '
    ].join(' '),
	   [username],
     responder
  );

	function responder(err, result){
		if (err) winston.error('Error! ', err);
		const rows = result.length;
		if (rows === 1) {
			res.status(200).send(true);
		} else {
			res.status(200).send(false);
		}
	}
};

exports.check_faculty_user_employee_id = (req, res, next) => {
  const employee_id = req.body.employee_id;

  db.query(
    [
      'SELECT employee_id FROM faculty_user',
      'WHERE employee_id = ?; '
    ].join(' '),
	   [employee_id],
     responder
  );

	function responder(err, result){
		if (err) winston.error('Error! ', err);
		const rows = result.length;
		if (rows === 1) {
			res.status(200).send(true);
		} else {
			res.status(200).send(false);
		}
	}
};

exports.check_student_number = (req, res, next) => {
  const student_number = req.query.student_number;
  const course_id = req.query.course_id;

  db.query(
    [
      'SELECT student_number FROM student st, section s, student_section ss',
      'WHERE s.course_id = ? AND s.id = ss.section_id AND ss.student_id = st.id AND st.student_number = ?;'
    ].join(' '),
	   [course_id, student_number],
     responder
  );

	function responder(err, result){
		if (err) winston.error('Error! ', err);
		let rows = result.length;
    if (rows == 1) {
			res.status(200).send(true);
		} else {
			res.status(200).send(false);
		}
	}
};

exports.get_logged_in_faculty_user_id = (req, res, next) => {
  if(req.session.user==null){
  	res.send(false);
  	return;
  }
  res.send(req.session.user);
};

exports.post_volunteer = (req, res, next) => {

    const data = {
        user_id:                req.session.user.id,
        course_code:            req.query.course_code,
        section_name:           req.query.section_name,
        section_code:           req.query.section_code,
        student_number:         req.body.student_number,
        given_name:             req.body.given_name,
        middle_name:            req.body.middle_name,
        last_name:              req.body.last_name,
        degree:                 req.body.degree,
        classification:         req.body.classification,
        college:                req.body.college
    };

    function start () {

        db.query (
            'CALL POST_VOLUNTEER(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                data.user_id, data.course_code, data.section_name,
                data.section_code, data.student_number, data.last_name,
                data.given_name, data.middle_name, data.classification,
                data.college, data.degree
            ],
            send_response
        );
    }

    function send_response (err, result, args, last_query) {
        if (err) {
            winston.error('Error in Creating Volunteer', last_query);
            return next(err);
        }
        res.send(result[0][0]);
    }

    start();
};

exports.get_volunteers = (req, res, next) => {

    const data = {
        user_id:               req.query.user_id,
        course_code:           req.query.course_code,
        section_name:          req.query.section_name
    };

    function start() {
        db.query (
            [
                'SELECT s.student_number, s.last_name, s.given_name, sect.code',
                'FROM faculty_user f, course c, faculty_user_course fc,',
                'student s, section sect, student_section ss',
                'WHERE f.id = fc.faculty_user_id and c.id = fc.course_id',
                'and sect.course_id = c.id and sect.id = ss.section_id and s.id = ss.student_id',
                'and f.id = ? and c.code = ? and sect.name = ?;'
            ].join(' '),
            [data.user_id, data.course_code, data.section_name],
            send_response
        );
    }

    function send_response (err, result, args, last_query) {
        if (err) {
            winston.error('Error in getting students', last_query);
            return next(err);
        }
        res.send(result);
    }

    start();
};

exports.update_volunteer = (req, res, next) => {
    const data = {
        user_id:                req.body.user_id,                   //*
        course_code:            req.body.course_code,//CMSC 128     //*
        section_name:           req.body.section_name,              //*
        old_section_code:       req.body.old_section_code,//Used to get old section_id
        section_code:           req.body.section_code,//Used to replace old value of section_id on student_section
        old_student_number:     req.body.old_student_number,//Needed this because old_SN will be used to get student_id     //*
        student_number:         req.body.student_number,//This var will be used to replace old value of SN
        given_name:             req.body.given_name,
        middle_name:            req.body.middle_name,
        last_name:              req.body.last_name,
        degree:                 req.body.degree,
        classification:         req.body.classification,
        college:                req.body.college
    };

    function start () {
        db.query (
            'CALL UPDATE_VOLUNTEER(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                data.user_id, data.course_code, data.section_name,
                data.old_section_code, data.section_code, data.old_student_number,
                data.student_number, data.last_name, data.given_name,
                data.middle_name, data.classification,
                data.college, data.degree
            ],
            send_response
        );
    }

    function send_response (err, result, args, last_query) {
        if (err) {
            winston.error('Error in Creating Volunteer', last_query);
            return next(err);
        }
        res.send(result[0][0]);
    }

    start();
};

exports.delete_volunteer = (req, res, next) => {

    const data = {
        user_id:                req.body.user_id,
        course_code:            req.body.course_code,
        section_name:           req.body.section_name,
        section_code:           req.body.section_code,
        student_number:         req.body.student_number
    }

    function start () {
        db.query (
            'CALL DELETE_VOLUNTEER(?, ?, ?, ?, ?)',
            [data.user_id, data.course_code, data.section_name, data.section_code, data.student_number],
            send_response
        );
    }


    function send_response (err, result, args, last_query) {
        if (err) {
            winston.error('Error in deleting student', last_query);
            return next(err);
        }

        res.send(result[0][0]);
    }

    start();
};

exports.randomize = (req, res, next) => {

    const data = {
        user_id:                req.body.user_id,
        course_code:            req.body.course_code,
        section_name:           req.body.section_name,
        section_code:           req.body.section_code,
        limit:                  req.body.limit
    };

    function start () {

    	if (typeof data.section_code === 'undefined') {
	        db.query (
	            'DROP VIEW IF EXISTS temporary_view' + data.user_id + ';',
	            create_view
	        );
	    } else {
	    	db.query (
	            'DROP VIEW IF EXISTS temporary_view' + data.user_id + data.section_code + ';',
	            create_view
	        );
	    }
    }

    function create_view (err, result, args, last_query) {
        if (err) {
            winston.error('Error in dropping view', last_query);
            return next(err);
        }
        if (typeof data.section_code === 'undefined') {
            db.query (
                [
                    'CREATE VIEW temporary_view' + data.user_id + ' AS',
                    'SELECT stud.id, stud.student_number, stud.last_name, stud.given_name, stud.middle_name, stud.frequency',
                    'FROM faculty_user u, course c, faculty_user_course uc, student stud, section sect, student_section ss',
                    'where u.id = uc.faculty_user_id and c.id = uc.course_id and sect.course_id = c.id',
                    'and sect.id = ss.section_id and stud.id = ss.student_id',
                    'and u.id = ? and c.code = ? and sect.name = ?;'
                ].join(' '),
                [data.user_id, data.course_code, data.section_name],
                randomize
            );
        }
        else {
            db.query (
                [
                    'CREATE VIEW temporary_view' + data.user_id + data.section_code + ' AS',
                    'SELECT stud.id, stud.student_number, stud.last_name, stud.given_name, stud.middle_name, stud.frequency',
                    'FROM faculty_user u, course c, faculty_user_course uc, student stud, section sect, student_section ss',
                    'where u.id = uc.faculty_user_id and c.id = uc.course_id and sect.course_id = c.id',
                    'and sect.id = ss.section_id and stud.id = ss.student_id',
                    'and u.id = ? and c.code = ? and sect.name = ? and sect.code = ?;'
                ].join(' '),
                [data.user_id, data.course_code, data.section_name, data.section_code],
                randomize
            );
        }
    }

    function randomize (err, result, args, last_query) {
        if (err) {
            winston.error('Error in creating view', last_query);
            return next(err);
        }
        if(typeof data.limit === 'undefined') {
            db.query(
                    'SELECT * FROM temporary_view' + data.user_id + ' ORDER BY frequency,rand() LIMIT 1;',
                    [parseInt(data.limit)],
                    send_response
                );
        } else if (typeof data.section_code === 'undefined') {
        	db.query(
                    'SELECT * FROM temporary_view' + data.user_id + ' ORDER BY frequency,rand() LIMIT ?;',
                    [parseInt(data.limit)],
                    send_response
                );
        } else {
            db.query(
                    'SELECT * FROM temporary_view' + data.user_id + data.section_code + ' ORDER BY frequency,rand() LIMIT ?;',
                    [parseInt(data.limit)],
                    send_response
                );
        }
    }

    function send_response (err, result, args, last_query) {
        if (err) {
            winston.error('Error in randomizing students', last_query);
            return next(err);
        }

        for (var i = 0; i < result.length; i++) {
            var id = result[i].id;
            var frequency = result[i].frequency;
            db.query (
                'UPDATE student SET frequency = ? WHERE id = ?',
                [parseInt(frequency) + 1, id]
            )
        }

        res.send(result);
    }

    start();
};

exports.cheat_mode = (req, res, next) => {

	const data = {
		student_number:			req.body.student_number,
		user_id:				req.body.user_id,
		course_code:			req.body.course_code,
		section_name:			req.body.section_name
	};

	function start () {

		db.query(
			'CALL CHEAT_MODE(?, ?, ?, ?)',
			[data.student_number, data.user_id, data.course_code, data.section_name],
			send_response
		);
	}

	function send_response (err, result, args, last_query) {
		if (err) {
			winston.error('Error in updating frequency', last_query);
			return next(err);
		}

		res.send(result[0][0]);
	}

	start();
};
