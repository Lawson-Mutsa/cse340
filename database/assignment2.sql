-- Inserting new record to account table
INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- Modifying account_type for Tony Stark
UPDATE public. account SET account_type = 'Admin' WHERE account_email = 'tony@starkent.com';

-- Deleting Tony Stark record
DELETE FROM public.account WHERE account_email = 'tony@starkent.com';

-- Changing from small interiors to large interiors.
UPDATE public.inventory 
SET inv_description = REPLACE(inv_description, 'small interiors', 'large interiors')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

-- Inner Join
SELECT i.inv_make, i.inv_model, c.classification_name
FROM public.inventory i
JOIN public.classification c ON i.classification_id = c.classification_id WHERE c.classification_name = 'Sport';

-- Updating inventory image and thumbnail
UPDATE public.inventory 
SET inv_image = REPLACE(inv_image,'/images', '/images/vehicles'),
inv_thumbnail = REPLACE(inv_thumbnail,'/images', '/images/vehicles');